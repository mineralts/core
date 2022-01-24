import Channel from './Channel'
import DmUser from '../../../api/entities/user/DmUser'
import { Snowflake } from '../../../api/types'

export default interface DMChannel extends Channel {
  id: Snowflake,
  lastMessageId: Snowflake,
  recipients: DmUser[],
}