import { DateTime } from 'luxon'
import GuildMember from './GuildMember'

export default interface ThreadMember {
  member: GuildMember
  joinedAt: DateTime
}