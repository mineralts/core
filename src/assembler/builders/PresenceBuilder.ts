import { Client, Collection, Guild, GuildMember, Presence, PresenceStatus, Snowflake } from '../../api/entities'
import { keyFromEnum } from '../../api/utils'
import ActivityBuilder from './ActivityBuilder'
import Game from '../../api/entities/presence/Game'
import { DateTime } from 'luxon'

export default class PresenceBuilder {
  constructor (private client: Client, private guild: Guild | undefined, private readonly guildMembers: Collection<Snowflake, GuildMember>) {
  }

  public build (payload: any) {
    const activityBuilder = new ActivityBuilder(this.guild)

    const presence = new Presence(
      this.guildMembers.get(payload.user.id)!,
      keyFromEnum(PresenceStatus, payload.status) as keyof typeof PresenceStatus,
      payload.client_status.web || null,
      payload.client_status.desktop || null,
      payload.client_status.mobile || null,
      payload.activities.flatMap((item: any) => activityBuilder.build(item)),
      undefined
    )

    if ('game' in payload && payload.game) {
      const timestamps = payload.game.timestamps ? {
        start: payload.game.timestamps.start ? DateTime.fromMillis(payload.game.timestamps.start) : undefined,
        end: payload.game.timestamps.end ? DateTime.fromMillis(payload.game.timestamps.end) : undefined
      } : {}

      const assets = {
        smallText: payload.game.assets?.small_text,
        smallImage: payload.game.assets?.small_image,
        largeText: payload.game.assets?.large_text,
        largeImage: payload.game.assets?.large_image
      }

      presence.game = new Game(
        payload.game.type,
        timestamps,
        payload.game.state,
        payload.game.session_id,
        payload.game.party,
        payload.game.name,
        payload.game.id,
        payload.game.details,
        DateTime.fromMillis(payload.game.created_at),
        assets,
        payload.game.application_id
      )
    }

    return presence
  }
}