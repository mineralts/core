import { Snowflake } from '../../types'
import Channel from './Channel'
import DmUser from '../user/DmUser'

export default class DMChannel extends Channel {
  constructor (
    id: Snowflake,
    public lastMessageId: Snowflake,
    public recipients: DmUser[],
  ) {
    super(id, 'DM', undefined, undefined, undefined, undefined, 0, undefined)
  }
}