import Packet from '../entities/Packet'
import GuildMember from '../../api/entities/guild/GuildMember'
import Guild from '../../api/entities/guild/Guild'
import Application from '../../application/Application'

export default class MemberLeavePacket extends Packet {
  public packetType = 'GUILD_MEMBER_REMOVE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')

    const guild: Guild | undefined = client?.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const guildMember: GuildMember | undefined = guild.members.cache.get(payload.user.id) || guild.bots.cache.get(payload.user.id)
    if (!guildMember) {
      return
    }

    emitter.emit('leave:Member', guildMember)

    if (guildMember.user.isBot()) {
      guild.bots.cache.delete(guildMember.id)
    } else {
      guild.members.cache.delete(guildMember.id)
    }
  }
}