import Activity from '../activity'
import GuildMember from '../guild/GuildMember'
import { PresenceStatus } from '../../../api/types'

export default interface Presence {
  readonly member: GuildMember
  readonly status: keyof typeof PresenceStatus
  readonly web: string | null
  readonly desktop: string | null
  readonly mobile: string | null
  readonly activities: Activity[]
}