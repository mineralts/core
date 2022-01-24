import { Snowflake } from '../../../api/types'
import Guild from '../guild/Guild'

export default interface Role {
  readonly id: Snowflake
  readonly name: string
  readonly unicodeEmoji: string | null
  readonly position: number
  readonly permissions: string
  readonly mentionable: boolean
  readonly managed: boolean
  readonly icon: any
  readonly hoist: boolean
  readonly color: number
  readonly guild: Guild

  isMentionable (): boolean
  isManaged (): boolean
}