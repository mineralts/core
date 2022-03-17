import { DateTime } from 'luxon'
import GuildMember from '../guild/GuildMember'
import TextChannelResolvable from './TextChannelResolvable'
import ThreadMemberManager from '../guild/ThreadMemberManager'
import { ChannelTypeResolvable, Snowflake } from '../../../api/types'

export default interface ThreadChannel extends TextChannelResolvable {
  type: keyof typeof ChannelTypeResolvable,
  isLocked: boolean,
  isArchived: boolean,
  createdAt: DateTime,
  archivedAt: DateTime,
  autoArchiveDuration: number,
  ownerId: Snowflake,
  owner: GuildMember | undefined,
  messageCount: number,
  memberCount: number,
  members: ThreadMemberManager

  isPrivateThread (): boolean
  isPublicThread (): boolean
}