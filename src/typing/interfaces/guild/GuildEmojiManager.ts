import Collection from '../../../api/utils/Collection'
import { Snowflake } from '../../../api/types'
import Emoji from '../emoji'

export default interface GuildEmojiManager {
  readonly cache: Collection<Snowflake, Emoji>
}