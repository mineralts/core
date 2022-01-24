import Collection from '../../../api/utils/Collection'
import { Snowflake } from '../../../api/types'
import Message from './index'

export default interface MessageManager {
  readonly cache: Collection<Snowflake, Message>

  fetch (id: Snowflake): Promise<Message>
  fetch (options?: { before?: Snowflake, after?: Snowflake, around?: Snowflake, limit?: number }): Promise<void>
  fetch (value?: { before?: Snowflake, after?: Snowflake, around?: Snowflake, limit?: number } | Snowflake): Promise<Message | void>
}