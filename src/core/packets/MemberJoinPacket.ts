import Packet from '../entities/Packet'
import { GuildMemberBuilder } from '../../assembler/builders'
import Ioc from '../../Ioc'

export default class MemberJoinPacket extends Packet {
  public packetType = 'GUILD_MEMBER_ADD'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild = client?.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const guildMemberBuilder = new GuildMemberBuilder(client, guild.roles.cache, guild)
    const guildMember = guildMemberBuilder.build(payload)

    if (guildMember.user.isBot()) {
      guild.bots.cache.set(guildMember.id, guildMember)
    } else {
      guild.members.cache.set(guildMember.id, guildMember)
    }

    // const request = await assembler.connector.http.get(`/guilds/${guild!.id}/invites`) as any[]

    // const invite = request.map((item: any) => {
    //   return invites.find((invite) => invite.count < item.uses)
    // }).shift() as unknown as Invite
    //
    // invite.count++

    emitter.emit('join:Member', guildMember)
  }
}