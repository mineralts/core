/*
 * packages/CommandOptions.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { ChannelResolvable } from '../../../api/types'
import GuildMember from '../guild/GuildMember'

export default interface CommandOptions {
  getChannel (name: string): ChannelResolvable | undefined
  getMember (name: string): GuildMember | undefined
  getString (name: string): string | undefined
  getNumber (name: string): number | undefined
  getBoolean (name: string): boolean | undefined
  getChoices<T> (name: string): T | undefined
}