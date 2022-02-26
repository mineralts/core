import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import { GuildMemberBuilder } from '../../assembler/builders'

export default class MemberJoinPacket extends Packet {
  public packetType = 'GUILD_MEMBER_ADD'

  public async handle (assembler: Assembler, payload: any) {
    const client = assembler.application.client
    const guild = client.guilds.cache.get(payload.guild_id)

    const guildMemberBuilder = new GuildMemberBuilder(client as any, guild!.roles.cache as any, guild as any)
    const guildMember = guildMemberBuilder.build(payload)

    if (guildMember.user.isBot()) {
      guild?.bots.cache.set(guildMember.id, guildMember)
    } else {
      guild?.members.cache.set(guildMember.id, guildMember)
    }

    // const request = await assembler.connector.http.get(`/guilds/${guild!.id}/invites`) as any[]

    // const invite = request.map((item: any) => {
    //   return invites.find((invite) => invite.count < item.uses)
    // }).shift() as unknown as Invite
    //
    // invite.count++

    assembler.eventListener.emit('join:Member', guildMember)
  }
}