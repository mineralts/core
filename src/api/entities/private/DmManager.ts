/*
 * packages/DmManager.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import Collection from '../../utils/Collection'
import { Snowflake } from '../../types'
import DMChannel from '../channels/DMChannel'

export default class DmManager {
  public cache: Collection<Snowflake, DMChannel> = new Collection()

  public register (channels: Collection<Snowflake, DMChannel>) {
    this.cache = channels
    return this
  }
}