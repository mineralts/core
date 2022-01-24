import Collection from '../../../api/utils/Collection'
import GuildMember from './GuildMember'
import { Snowflake } from '../../../api/types'

export default interface GuildMemberManager {
  readonly cache: Collection<Snowflake, GuildMember>
}