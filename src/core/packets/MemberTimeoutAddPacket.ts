import Packet from '../entities/Packet'
import { DateTime } from 'luxon'
import Application from '../../application/Application'

export default class MemberTimeoutAddPacket extends Packet {
  public packetType = 'GUILD_MEMBER_UPDATE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')

    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const guildMember = guild.members.cache.get(payload.user.id)
    if (!guildMember) {
      return
    }

    if (payload.communication_disabled_until) {
      const expire: DateTime = DateTime.fromISO(payload.communication_disabled_until)
      const duration = expire.diffNow().toMillis()

      guildMember.communicationTimeout = expire
      emitter.emit('add:MemberTimeout', guildMember, duration)
    }
  }
}