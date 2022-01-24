import Collection from '../../utils/Collection'
import { Snowflake } from '../../types'
import Role from '../roles'

export default class GuildMemberRoleManager {
  public cache: Collection<Snowflake, Role> = new Collection()

  public register (roles: Role[]) {
    roles.forEach((role: Role) => {
      this.cache.set(role.id, role)
    })
    return this
  }
}