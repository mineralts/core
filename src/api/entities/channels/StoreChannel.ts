/*
 * packages/StoreChannel.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { Snowflake } from '../../types'
import Channel from '../../../api/entities/channels/Channel'
import Guild from '../../../api/entities/guild/Guild'
import CategoryChannel from '../../../api/entities/channels/CategoryChannel'

export default class StoreChannel extends Channel {
  constructor (
    id: Snowflake,
    name: string,
    guildId: Snowflake,
    guild: Guild | undefined,
    position: number,
    parentId: Snowflake | undefined,
    public nsfw: boolean,
    public permissions: any[],
    parent?: CategoryChannel,
  ) {
    super(id, 'GUILD_STORE', name, guildId, guild, parentId, position, parent)
  }
}