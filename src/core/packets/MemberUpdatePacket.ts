import Packet from '../entities/Packet'
import { GuildMemberBuilder } from '../../assembler/builders'
import Application from '../../application/Application'

export default class MemberUpdatePacket extends Packet {
  public packetType = 'GUILD_MEMBER_UPDATE'

  public async handle (payload: any) {
    console.log(payload)
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')

    const guild = client?.guilds.cache.get(payload.guild_id)
    const before = guild?.members.cache.get(payload.user.id)

    const guildMemberBuilder = new GuildMemberBuilder(client as any, guild!.roles.cache as any, guild as any)
    const after = guildMemberBuilder.build(payload)

    if (after.user.isBot()) {
      guild?.bots.cache.set(after.id, after)
    } else {
      guild?.members.cache.set(after.id, after)
    }

    emitter.emit('update:Member', before, after)
  }
}