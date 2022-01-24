import Collection from '../../../api/utils/Collection'
import {
  ExplicitContentLevel, Feature, GuildFeature, LocalPath, Milliseconds,
  NotificationLevel,
  Region,
  Snowflake, SystemChannelFlag,
  VerificationLevel
} from '../../../api/types'
import GuildMember from './GuildMember'
import VoiceChannel from '../channels/VoiceChannel'
import TextChannel from '../channels/TextChannel'
import GuildRoleManager from './GuildRoleManager'
import GuildChannelManager from './GuildChannelManager'
import GuildStickerManager from './GuildStickerManager'
import GuildMemberManager from './GuildMemberManager'
import GuildThreadManager from './GuildThreadManager'
import GuildEmojiManager from './GuildEmojiManager'
import InviteManager from '../invitation/InviteManager'
import GuildHashes from './GuildHashes'
import { Command } from '../../../forge/entities/Command'

export default interface Guild {
  readonly commands: Collection<Snowflake, Command>
  readonly id: Snowflake
  readonly name: string
  readonly icon: string | null
  readonly banner: string | null
  readonly splash: string | null
  readonly discoverySplash: string | null
  readonly description: string | undefined
  readonly premiumTier: number
  readonly premiumSubscriptionCount: number
  readonly systemChannelFlags: number
  readonly explicitContentFilter: number
  readonly region: keyof typeof Region
  readonly isLazy: boolean
  readonly applicationId: string | null
  readonly nsfw: boolean
  readonly memberCount: number
  readonly roles: GuildRoleManager
  readonly stageInstances: []
  readonly guildHashes: GuildHashes
  readonly afkChannelId: Snowflake
  readonly publicUpdateChannelId: Snowflake
  readonly channels: GuildChannelManager
  readonly verificationLevel: number
  readonly hasPremiumProgressBarEnabled: boolean
  readonly features: GuildFeature[]
  readonly stickers: GuildStickerManager
  readonly members: GuildMemberManager
  readonly bots: GuildMemberManager
  readonly ruleChannelId: Snowflake
  readonly guildScheduledEvents: any[]
  readonly defaultMessageNotifications: keyof typeof NotificationLevel
  readonly mfaLevel: number
  readonly threads: GuildThreadManager
  readonly maxMemberSize: number
  readonly emojis: GuildEmojiManager
  readonly defaultLang: string
  readonly ownerId: Snowflake
  readonly owner: GuildMember | undefined
  readonly maxVideoChannelUsers: number
  readonly registeredCommandCount: number
  readonly applicationCommandCount: number
  readonly afkTimeout: number
  readonly systemChannelId: Snowflake
  readonly vanityUrlCode: string | null
  readonly embeddedActivities: any[]
  readonly invites: InviteManager

  setName (value: string): Promise<void>
  setPreferredLocale (region: keyof typeof Region): Promise<void>
  leave (): Promise<void>
  isNsfw (): boolean
  setAfkChannel (voiceChannel: VoiceChannel | Snowflake): Promise<void>
  setVerificationLevel (level: keyof typeof VerificationLevel): Promise<void>
  setNotificationLevel (level: keyof typeof NotificationLevel): Promise<void>
  setExplicitContentFilter (level: keyof typeof ExplicitContentLevel): Promise<void>
  setAfkTimeout (value: Milliseconds): Promise<void>
  hasFeature(feature: keyof typeof Feature): boolean
  setIcon (path: LocalPath): Promise<void>
  removeIcon (): Promise<void>
  setOwner (member: GuildMember | Snowflake): Promise<void>
  setSplash (path: string): Promise<void>
  setDiscoverySplash (path: string): Promise<void>
  setBanner (path: string): Promise<void>
  setSystemChannel (channel: TextChannel | Snowflake): Promise<void>
  setSystemChannelFlag (flag: keyof typeof SystemChannelFlag): Promise<void>
  setRuleChannel (channel: TextChannel | Snowflake): Promise<void>
  setPublicUpdateChannel (channel: TextChannel | Snowflake): Promise<void>
}