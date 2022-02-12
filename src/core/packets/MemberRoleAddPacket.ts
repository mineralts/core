import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import { Client, Guild, GuildMember, Role, Snowflake } from '../../api/entities'
import Collection from '../../api/utils/Collection'

export default class MemberRoleAddPacket extends Packet {
  public packetType = 'GUILD_MEMBER_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    const client: Client = assembler.application.client
    const guild: Guild | undefined = client.guilds.cache.get(payload.guild_id)
    const member: GuildMember | undefined = guild?.members.cache.get(payload.user.id)

    if (!member) {
      assembler.application.logger.error('The member was not found.')
      return
    }

    if (payload.roles.length > member.roles.cache.size) {
      const currentRoles = member.roles.cache.clone()
      const targetRoles: Collection<Snowflake, Role> = new Collection()

      payload.roles.forEach((id: Snowflake) => {
        const role = guild?.roles.cache.get(id)
        if (role) {
          member.roles.cache.set(role.id, role)
          targetRoles.set(role.id, role)
        }
      })

      assembler.eventListener.emit(
        'guildMemberRoleAdd',
        member,
        currentRoles,
        targetRoles
      )
    }
  }
}