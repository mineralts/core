import Packet from '../entities/Packet'
import { PresenceBuilder } from '../../assembler/builders'
import Ioc from '../../Ioc'

export default class PresenceUpdatePacket extends Packet {
  public packetType = 'PRESENCE_UPDATE'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const presenceBuilder = new PresenceBuilder(client, guild, guild.members.cache)
    const presence = presenceBuilder.build(payload)

    const member = guild.members.cache.get(payload.user.id)
    if (!member) {
      return
    }

    emitter.emit('update:Presence', presence)
    member.user.presence = presence
  }
}