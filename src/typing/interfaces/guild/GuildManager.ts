import Collection from '../../../api/utils/Collection'
import { Snowflake } from '../../../api/types'
import Guild from '../guild/Guild'

export default interface GuildManager {
  readonly cache: Collection<Snowflake, Guild>
}