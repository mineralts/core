import Collection from '../../../api/utils/Collection'
import { ChannelOptionResolvable, ChannelResolvable, Snowflake } from '../../../api/types'

export default interface GuildChannelManager {
  readonly cache: Collection<Snowflake, ChannelResolvable>

  create (channel: ChannelOptionResolvable)
}