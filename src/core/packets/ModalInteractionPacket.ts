import Packet from '../entities/Packet'
import { InteractionType } from '../../api/types'
import ModalInteractionBuilder from '../../assembler/builders/ModalInteractionBuilder'
import Ioc from '../../Ioc'

export default class ModalInteractionPacket extends Packet {
  public packetType = 'INTERACTION_CREATE'

  public async handle (payload: any): Promise<void> {
    if (payload.type !== InteractionType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE) {
      return
    }

    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const member = guild.members.cache.get(payload.member.user.id)
    if (!member) {
      return
    }

    const interactionBuilder = new ModalInteractionBuilder(client, member!)
    const interaction = interactionBuilder.build(payload)

    emitter.emit('open:modal', interaction)
    emitter.emit(`open:modal::${interaction.customId}`, interaction)
  }
}