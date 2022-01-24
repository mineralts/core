import GuildMember from '../guild/GuildMember'
import { DateTime } from 'luxon'
import { ChannelResolvable } from '../../../api/types'

export default interface Invite {
  readonly owner: GuildMember
  readonly channel: ChannelResolvable
  readonly code: string
  readonly count: number
  readonly max: number
  readonly temporary: boolean
  readonly expireAt: DateTime
  readonly createdAt: DateTime
}