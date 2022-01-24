import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import { DateTime } from 'luxon'

export default class MemberTimeoutAddPacket extends Packet {
  public packetType = 'GUILD_MEMBER_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    const client = assembler.application.client
    const guild = client.guilds.cache.get(payload.guild_id)

    const guildMember = guild?.members.cache.get(payload.user.id)

    if (payload.communication_disabled_until) {
      const expire: DateTime = DateTime.fromISO(payload.communication_disabled_until)
      const duration = expire.diffNow().toMillis()

      guildMember!.communicationTimeout = expire
      assembler.eventListener.emit('memberTimeoutAdd', guildMember, duration)
    }
  }
}