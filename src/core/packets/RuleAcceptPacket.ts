import Packet from '../entities/Packet'
import GuildMember from '../../api/entities/guild/GuildMember'
import Guild from '../../api/entities/guild/Guild'
import Application from '../../application/Application'

export default class RuleAcceptPacket extends Packet {
  public packetType = 'GUILD_MEMBER_UPDATE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')
    const guild: Guild | undefined = client?.guilds.cache.get(payload.guild_id)
    const member: GuildMember | undefined = guild?.members.cache.get(payload.user.id)

    if (!member) {
      return
    }

    if (member.isPending() !== payload.pending) {
      member.pending = false
      emitter.emit('accept:Rules', client)
    }
  }
}