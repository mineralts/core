import Collection from '../../../api/utils/Collection'
import { RoleOption, Snowflake } from '../../../api/types'
import Role from '../roles'

export default interface GuildRoleManager {
  readonly cache: Collection<Snowflake, Role>

  create (options: RoleOption): Promise<void>
}