import { RTC_Region, Snowflake } from '../../types'
import Channel from './Channel'
import Guild from '../guild/Guild'
import CategoryChannel from './CategoryChannel'

export default class StageChannel extends Channel {
  constructor (
    id: Snowflake,
    name: string,
    topic: string | undefined,
    guildId: Snowflake,
    guild: Guild | undefined,
    public maxUser: number,
    public region: keyof typeof RTC_Region,
    public rateLimitPerUser: number,
    position: number,
    public permission: any[],
    parentId: Snowflake | undefined,
    public bitrate: number,
    parent?: CategoryChannel
  ) {
    super(id, 'GUILD_STAGE_VOICE', name, guildId, guild, parentId, position, parent)
  }
}