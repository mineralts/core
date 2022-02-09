import Packet from '../entities/Packet'
import Assembler from '../../assembler/Assembler'
import { InteractionType } from '../../api/types'
import ModalInteractionBuilder from '../../assembler/builders/ModalInteractionBuilder'

export default class ModalInteractionPacket extends Packet {
  public packetType = 'INTERACTION_CREATE'

  public async handle (assembler: Assembler, payload: any): Promise<void> {
    if (payload.type !== InteractionType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE) {
      return
    }

    const client = assembler.application.client
    const guild = client.guilds.cache.get(payload.guild_id)
    const member = guild?.members.cache.get(payload.member.user.id)

    const interactionBuilder = new ModalInteractionBuilder(assembler.application.client, member!)
    const interaction = interactionBuilder.build(payload)

    assembler.eventListener.emit('interactionModalCreate', interaction)
    assembler.eventListener.emit(`interactionModal::${interaction.customId}`, interaction)
  }
}