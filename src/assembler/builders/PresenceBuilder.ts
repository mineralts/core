import { Client, Snowflake, GuildMember, Presence, PresenceStatus, Collection, Guild } from '../../api/entities'
import { keyFromEnum } from '../../api/utils'
import ActivityBuilder from './ActivityBuilder'

export default class PresenceBuilder {
  constructor (private client: Client, private guild: Guild | undefined, private readonly guildMember: Collection<Snowflake, GuildMember>) {
  }

  public build (payload: any) {
    const activityBuilder = new ActivityBuilder(this.guild)

    return new Presence(
      this.guildMember.get(payload.user.id)!,
      keyFromEnum(PresenceStatus, payload.status) as keyof typeof PresenceStatus,
      payload.client_status.web || null,
      payload.client_status.desktop || null,
      payload.client_status.mobile || null,
      payload.activities.flatMap((item: any) => activityBuilder.build(item))
    )
  }
}