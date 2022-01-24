import { Snowflake } from '../../types'
import Channel from './Channel'
import Guild from '../guild/Guild'

export default class CategoryChannel extends Channel {
  constructor (
    id: Snowflake,
    position: number,
    name: string,
    guildId: Snowflake,
    guild: Guild | undefined,
  ) {
    super(id, 'GUILD_CATEGORY', name, guildId, guild, undefined, position)
  }
}