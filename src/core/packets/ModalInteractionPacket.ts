import Packet from '../entities/Packet'
import { InteractionType } from '../../api/types'
import ModalInteractionBuilder from '../../assembler/builders/ModalInteractionBuilder'
import Application from '../../application/Application'

export default class ModalInteractionPacket extends Packet {
  public packetType = 'INTERACTION_CREATE'

  public async handle (payload: any): Promise<void> {
    if (payload.type !== InteractionType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE) {
      return
    }

    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')

    const guild = client?.guilds.cache.get(payload.guild_id)
    const member = guild?.members.cache.get(payload.member.user.id)

    const interactionBuilder = new ModalInteractionBuilder(client!, member!)
    const interaction = interactionBuilder.build(payload)

    emitter.emit('interactionModalCreate', interaction)
    emitter.emit(`interactionModal::${interaction.customId}`, interaction)
  }
}