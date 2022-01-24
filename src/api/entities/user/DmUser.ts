/*
 * packages/DmUser.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { Snowflake } from '../../types'

export default class DmUser {
  constructor (
    public id: Snowflake,
    public flags: number,
    public username: string,
    public discriminator: string,
    public avatar: string | null
  ) {
  }
}