import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import { PresenceBuilder } from '../../assembler/builders'

export default class PresenceUpdatePacket extends Packet {
  public packetType = 'PRESENCE_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    const guild = assembler.application.client.guilds.cache.get(payload.guild_id)

    const presenceBuilder = new PresenceBuilder(assembler.application.client, guild, guild!.members.cache)
    const presence = presenceBuilder.build(payload)

    const member = guild?.members.cache.get(payload.user.id)

    if (!member) {
      assembler.application.logger.error('The member was not found.')
      return
    }

    assembler.eventListener.emit('presenceCreate', presence)
    member.user.presence = presence
  }
}