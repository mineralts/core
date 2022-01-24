import Collection from '../../../api/utils/Collection'
import { Snowflake } from '../../../api/types'
import Role from '../roles'

export default interface GuildMemberRoleManager {
  readonly cache: Collection<Snowflake, Role>
}