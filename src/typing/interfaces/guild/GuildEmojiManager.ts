import Collection from '../../../api/utils/Collection'
import { Snowflake } from '../../../api/types'
import Role from '../../../api/entities/roles'
import Emoji from '../emoji'

export default interface GuildEmojiManager {
  readonly cache: Collection<Snowflake, Emoji>

  create (options: { name: string, path: string, roles?: Role[] | Snowflake[], reason?: string }): Promise<Emoji>
}