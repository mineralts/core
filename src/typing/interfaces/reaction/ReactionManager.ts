import { Snowflake } from '../../../api/types'
import GuildMember from '../guild/GuildMember'
import Client from '../client'
import Reaction from './Reaction'
import Collection from '../../../api/utils/Collection'

export default interface ReactionManager {
  readonly cache: Collection<Snowflake, Reaction[]>

  remove (member: Snowflake | GuildMember | Client): Promise<void>
}