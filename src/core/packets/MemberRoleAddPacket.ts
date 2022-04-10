import Packet from '../entities/Packet'
import { Snowflake } from '../../api/types'
import Collection from '../../api/utils/Collection'
import Guild from '../../api/entities/guild/Guild'
import GuildMember from '../../api/entities/guild/GuildMember'
import Role from '../../api/entities/roles'
import Ioc from '../../Ioc'

export default class MemberRoleAddPacket extends Packet {
  public packetType = 'GUILD_MEMBER_UPDATE'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild: Guild | undefined = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const member: GuildMember | undefined = guild.members.cache.get(payload.user.id)
    if (!member) {
      return
    }

    if (payload.roles.length > member.roles.cache.size) {
      const currentRoles = member.roles.cache.clone()
      const targetRoles: Collection<Snowflake, Role> = new Collection()

      payload.roles.forEach((id: Snowflake) => {
        const role = guild.roles.cache.get(id)
        if (role) {
          member.roles.cache.set(role.id, role)
          targetRoles.set(role.id, role)
        }
      })

      emitter.emit(
        'add:MemberRole',
        member,
        currentRoles,
        targetRoles
      )
    }
  }
}