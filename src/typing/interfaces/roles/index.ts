import { RoleUpdateOption, Snowflake } from '../../../api/types'
import Guild from '../guild/Guild'

export default interface Role {
  readonly id: Snowflake
  readonly label: string
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
  delete (reason?: string): Promise<void>
  update (options: RoleUpdateOption): Promise<Role>
  setPosition (position: number): Promise<void>
}