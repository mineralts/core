import Collection from '../../utils/Collection'
import GuildMember from './GuildMember'
import { Snowflake } from '../../types'

export default class GuildMemberManager {
  public cache: Collection<Snowflake, GuildMember> = new Collection()

  public register (guildMembers: Collection<Snowflake, GuildMember>) {
    this.cache = guildMembers
    return this
  }
}