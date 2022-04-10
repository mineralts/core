import Packet from '../entities/Packet'
import { GuildMemberBuilder } from '../../assembler/builders'
import Ioc from '../../Ioc'

export default class MemberUpdatePacket extends Packet {
  public packetType = 'GUILD_MEMBER_UPDATE'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const before = guild.members.cache.get(payload.user.id)

    const guildMemberBuilder = new GuildMemberBuilder(client, guild.roles.cache, guild)
    const after = guildMemberBuilder.build(payload)

    if (after.user.isBot()) {
      guild.bots.cache.set(after.id, after)
    } else {
      guild.members.cache.set(after.id, after)
    }

    emitter.emit('update:Member', before, after)
  }
}