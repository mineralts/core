import { Snowflake } from '../../../api/types'
import Role from '../roles'

export default interface Emoji {
  readonly id: Snowflake
  readonly label: string
  readonly managed: boolean
  readonly available: boolean
  readonly animated: boolean
  readonly roles: Role[]

  update (options: { label: string, roles?: Role[] | Snowflake[], reason?: string }): Promise<Emoji>
  delete (reason?: string): Promise<void>
}