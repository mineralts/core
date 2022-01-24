import { Snowflake } from '../../types'
import Role from '../roles'
import Collection from '../../utils/Collection'
import GuildMember from '../guild/GuildMember'
import Channel from '../channels/Channel'

export default class MentionResolvable {
  constructor (
    public everyone: boolean,
    public roles: Collection<Snowflake, Role>,
    public members: Collection<Snowflake, GuildMember>,
    public channels: Collection<Snowflake, Channel>
  ) {
  }

  public isEveryone (): boolean {
    return this.everyone
  }
}