import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import GuildMember from '../../api/entities/guild/GuildMember'
import Guild from '../../api/entities/guild/Guild'

export default class RuleAcceptPacket extends Packet {
  public packetType = 'GUILD_MEMBER_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    const client = assembler.application.client
    const guild: Guild | undefined = client.guilds.cache.get(payload.guild_id)
    const member: GuildMember | undefined = guild?.members.cache.get(payload.user.id)

    if (!member) {
      return
    }

    if (member.isPending() !== payload.pending) {
      member.pending = false
      assembler.eventListener.emit('accept:Rules', client)
    }
  }
}