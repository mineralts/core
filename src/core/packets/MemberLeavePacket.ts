import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import { Guild, GuildMember } from '../../api/entities'

export default class MemberLeavePacket extends Packet {
  public packetType = 'GUILD_MEMBER_REMOVE'

  public async handle (assembler: Assembler, payload: any) {
    const client = assembler.application.client
    const guild: Guild | undefined = client.guilds.cache.get(payload.guild_id)

    const guildMember: GuildMember | undefined = payload.user.bot
      ? guild?.members.cache.get(payload.user.id)
      : guild?.bots.cache.get(payload.user.id)

    assembler.eventListener.emit('guildMemberLeave', guildMember)

    if (guildMember!.user.isBot()) {
      guild?.bots.cache.delete(guildMember!.id)
    } else {
      guild?.members.cache.delete(guildMember!.id)
    }
  }
}