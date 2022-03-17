import { DateTime } from 'luxon'
import GuildMember from './GuildMember'

export default class ThreadMember {
  constructor (
    public member: GuildMember,
    public joinedAt: DateTime
  ) {
  }
}