import { Snowflake } from '../../../api/types'
import User from '../user'
import { DateTime } from 'luxon'
import Guild from './Guild'
import GuildMemberRoleManager from './GuildMemberRoleManager'
import Role from '../roles'
import VoiceState from '../voice/VoiceState'

export default interface GuildMember {
  readonly id: Snowflake
  readonly username: string
  readonly user: User
  readonly guild: Guild
  readonly roles: GuildMemberRoleManager
  readonly highestRole: Role | null
  readonly pending: boolean
  readonly voice: VoiceState
  readonly communicationTimeout: DateTime | null
  readonly joinedAt: DateTime

  isPending (): boolean
  setUsername (value: string): Promise<void>
  exclude (date: DateTime, reason?: string): Promise<void>
  sorry (reason?: string): Promise<void>
  ban (options: { messageCount?: number, reason?: string }): Promise<void>
  unban (reason?: string): Promise<void>
  kick (reason?: string): Promise<void>
}