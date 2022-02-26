import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import GuildMember from '../../api/entities/guild/GuildMember'
import Guild from '../../api/entities/guild/Guild'

export default class MemberLeavePacket extends Packet {
  public packetType = 'GUILD_MEMBER_REMOVE'

  public async handle (assembler: Assembler, payload: any) {
    const client = assembler.application.client
    const guild: Guild | undefined = client.guilds.cache.get(payload.guild_id)

    const guildMember: GuildMember | undefined = guild?.members.cache.get(payload.user.id) || guild?.bots.cache.get(payload.user.id)

    assembler.eventListener.emit('leave:Member', guildMember)

    if (guildMember!.user.isBot()) {
      guild?.bots.cache.delete(guildMember!.id)
    } else {
      guild?.members.cache.delete(guildMember!.id)
    }
  }
}