/*
 * @mineralts/Forge.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { DateTime } from 'luxon'
import Invite from '../entities/invitation/Invite'
import GuildMember from '../entities/guild/GuildMember'
import TextChannelResolvable from '../entities/channels/TextChannelResolvable'
import Presence from '../entities/presence'
import Reaction from '../entities/reaction/Reaction'
import Message from '../entities/message'
import Guild from '../entities/guild/Guild'
import Client from '../entities/client'
import StringArgument from '../command/StringArgument'
import NumberArgument from '../command/NumberArgument'
import ChoiceArgument from '../command/ChoiceArgument'
import TextChannel from '../entities/channels/TextChannel'
import VoiceChannel from '../entities/channels/VoiceChannel'
import CategoryChannel from '../entities/channels/CategoryChannel'
import StageChannel from '../entities/channels/StageChannel'
import RateLimit from '../entities/rateLimit'
import ButtonInteraction from '../entities/interaction/ButtonInteraction'
import SelectMenuInteraction from '../entities/interaction/SelectMenuInteraction'
import CommandInteraction from '../entities/interaction/CommandInteraction'
import Button from '../entities/button'
import ButtonLink from '../entities/button/ButtonLink'
import SelectMenu from '../entities/select-menu'
import MessageEmbed from '../entities/embed/MessageEmbed'
import EmbedRow from '../entities/embed/EmbedRow'
import MessageAttachment from '../entities/message/MessageAttachment'
import Color from '../entities/colors'
import Emoji from '../entities/emoji'
import DMChannel from '../entities/channels/DMChannel'
import NewsChannel from '../entities/channels/NewsChannel'
import StoreChannel from '../entities/channels/StoreChannel'
import EmbedAuthor from '../entities/embed/EmbedAuthor'
import EmbedImage from '../entities/embed/EmbedImage'
import EmbedThumbnail from '../entities/embed/EmbedThumbnail'
import EmbedVideo from '../entities/embed/EmbedVideo'
import EmbedFooter from '../entities/embed/EmbedFooter'
import { Role } from '../../typing/interfaces'
import Modal from '../entities/modal'
import ModalInteraction from '../../typing/interfaces/interaction/ModalInteraction'
import Collection from '../utils/Collection'
import { WebsocketPayload } from '@mineralts/connector-preview'

export type Snowflake = string
export type Milliseconds = number
export type LocalPath = string
export type Url = string

export enum Intent {
  GUILDS = 1,
  GUILD_MEMBERS = 2,
  GUILD_BANS = 4,
  GUILD_EMOJIS_AND_STICKERS = 8,
  GUILD_INTEGRATIONS = 16,
  GUILD_WEBHOOKS = 32,
  GUILD_INVITES = 64,
  GUILD_VOICE_STATES = 128,
  GUILD_PRESENCES = 256,
  GUILD_MESSAGES = 512,
  GUILD_MESSAGE_REACTIONS = 1024,
  GUILD_MESSAGE_TYPING = 2048,
  DIRECT_MESSAGES = 4096,
  DIRECT_MESSAGE_REACTIONS = 8192,
  DIRECT_MESSAGE_TYPING = 16384,
  ALL = 32767,
}

export const FlagLabel = {
  0: 'None',
  1: 'Discord employee',
  2: 'Partnered owner server',
  4: 'HypeSquad events',
  8: 'Bug Hunter 1',
  64: 'House Bravery',
  128: 'House Brillance',
  256: 'House Balance',
  512: 'Early supporter',
  16384: 'Bug Hunter 2',
  131072: 'Early verified bot developer',
}

export const FlagIdentifier = {
  0: 'NONE',
  1: 'DISCORD_EMPLOYEE',
  2: 'PARTNERED_SERVER_OWNER',
  4: 'HYPESQUAD_EVENTS',
  8: 'BUG_HUNTER_LEVEL_1',
  64: 'HOUSE_BRAVERY',
  128: 'HOUSE_BRILLANCE',
  256: 'HOUSE_BALANCE',
  512: 'EARLY_SUPPORTER',
  16384: 'BUG_HUNTER_LEVEL_2',
  131072: 'EARLY_VERIFIED_BOT_DEVELOPER',
}

export const PremiumType = {
  0: 'None',
  1: 'Nitro Classic',
  2: 'Nitro'
}

export type ClientOptions = {
  shardCount?: 1
  messageCacheLifetime?: 0
  messageSweepInterval?: 0
  invalidRequestWarningInterval?: 0
  intents?: 'ALL' | Exclude<keyof typeof Intent, 'ALL'>[],
  restWsBridgeTimeout?: 5000
  restRequestTimeout?: 15000
  restGlobalRateLimit?: 0
  retryLimit?: 1
  restTimeOffset?: 500
  restSweepInterval?: 60
  failIfNotExists?: true
  userAgentSuffix?: []
}

export enum ActivityType {
  'PLAYING',
  'STREAMING',
  'LISTENING',
  'WATCHING',
  'CUSTOM',
  'COMPETING'
}

export type ActivityTimestamps = { start: DateTime | undefined, end: DateTime | undefined }

export type ActivityAssets = {
  smallText: string | undefined,
  smallImage: string | undefined,
  largeText: string | undefined,
  largeImage: string | undefined,
}

export enum ChannelTypeResolvable {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_NEWS = 5,
  GUILD_STORE = 6,
  GUILD_NEWS_THREAD = 10,
  GUILD_PUBLIC_THREAD = 11,
  GUILD_PRIVATE_THREAD = 12,
  GUILD_STAGE_VOICE = 13,
}

export type RequestOptions = {
  retryOnRateLimit: boolean
}

export enum VideoQuality {
  AUTO = 1,
  FULL = 2
}

export enum Region {
  FRANCE = 'fr',
  ENGLAND = 'en_US',
  SPAIN = 'es-ES',
  GERMANY = 'de',
  DENMARK = 'da',
  CROATIA = 'hr',
  ITALY = 'it',
  LITHUANIA = 'lt',
  HUNGARY = 'hu',
}

export enum RTC_Region {
  US_WEST = 'us-west',
  US_EAST = 'us-east',
  US_CENTRAL = 'us-central',
  US_SOUTH = 'us-south',
  SINGAPORE = 'singapore',
  SOUTH_AFRICA = 'southafrica',
  SYDNEY = 'sydney',
  ROTTERDAM = 'rotterdam',
  BRAZIL = 'brazil',
  HONG_KONG = 'hongkong',
  RUSSIA = 'russia',
  JAPAN = 'japan',
  INDIA = 'india',
  AUTO = 'null'
}

export enum VerificationLevel {
  NONE,
  LOW,
  MEDIUM,
  HIGH,
  VERY_HIGH,
}

export enum ExplicitContentLevel {
  DISABLED,
  MEMBERS_WITHOUT_ROLES,
  ALL_MEMBERS,
}

export enum NotificationLevel {
  ALL_MESSAGES,
  ONLY_MENTIONS
}

export type MessageComponentResolvable = Button | ButtonLink | SelectMenu | Modal

export enum Feature {
  ANIMATED_ICON,
  BANNER,
  COMMERCE,
  COMMUNITY,
  DISCOVERABLE,
  FEATURABLE,
  INVITE_SPLASH,
  MEMBER_VERIFICATION_GATE_ENABLED,
  MONETIZATION_ENABLED,
  MORE_STICKERS,
  NEWS,
  PARTNERED,
  PREVIEW_ENABLED,
  PRIVATE_THREADS,
  ROLE_ICONS,
  SEVEN_DAY_THREAD_ARCHIVE,
  THREE_DAY_THREAD_ARCHIVE,
  TICKETED_EVENTS_ENABLED,
  VANITY_URL,
  VERIFIED,
  VIP_REGIONS,
  WELCOME_SCREEN_ENABLED,
}

export enum BehaviorsExpiration {
  REMOVE_ROLE,
  KICK
}

export enum SystemChannelFlag {
  SUPPRESS_JOIN_NOTIFICATIONS = 1 << 0,
  SUPPRESS_PREMIUM_SUBSCRIPTIONS = 1 << 1,
  SUPPRESS_GUILD_REMINDER_NOTIFICATIONS = 1 << 2,
}

export interface ClientEvents {
  ready: [client: Client]
  guildCreate: [guild: Guild]
  messageCreate: [message: Message]
  messageUpdate: [before: Message | undefined, after: Message]
  messageDelete: [message: Message]
  channelCreate: [channel: ChannelResolvable]
  channelDelete: [channel: ChannelResolvable]
  channelUpdate: [before: ChannelResolvable, after: ChannelResolvable]
  rateLimit: [rateLimit: RateLimit]
  messageReactionAdd: [message: Message, reaction: Reaction]
  messageReactionRemove: [message: Message, reaction: Reaction]
  presenceUpdate: [before: Presence | undefined, after: Presence]
  emojiCreate: [emoji: Emoji]
  emojiUpdate: [before: Emoji, after: Emoji]
  emojiDelete: [emoji: Emoji]
  voiceJoin: [member: GuildMember]
  voiceLeave: [member: GuildMember]
  memberBoostAdd: [member: GuildMember]
  memberBoostRemove: [member: GuildMember]
  memberTimeoutAdd: [member: GuildMember, duration: number]
  memberTimeoutRemove: [member: GuildMember]
  interactionButtonCreate: [interaction: ButtonInteraction]

  [key: `interactionButton::${string}`]: [interaction: ButtonInteraction]

  interactionSelectMenuCreate: [interaction: SelectMenuInteraction]

  [key: `interactionSelectMenu::${string}`]: [interaction: SelectMenuInteraction]

  interactionCommandCreate: [interaction: CommandInteraction]

  [key: `interactionCommand::${string}`]: [interaction: CommandInteraction]

  interactionModalCreate: [interaction: ModalInteraction]

  rulesAccept: [member: GuildMember]
  guildMemberJoin: [member: GuildMember, invitation?: Invite]
  guildMemberLeave: [member: GuildMember]
  guildMemberRoleAdd: [member: GuildMember, before: Collection<Snowflake, Role>, after: Collection<Snowflake, Role>]
  guildMemberRoleRemove: [member: GuildMember, before: Collection<Snowflake, Role>, after: Collection<Snowflake, Role>]
  inviteCreate: [invite: Invite]
  inviteDelete: [invite: Invite]
  roleCreate: [role: Role]
  roleDelete: [role: Role]
  roleUpdate: [before: Role, after: Role]
  typingStart: [member: GuildMember, channel: TextChannelResolvable]
  wss: [payload: WebsocketPayload]
}

export const clientEvents = [
  'ready',
  'guildCreate',
  'messageCreate',
  'messageUpdate',
  'messageDelete',
  'channelCreate',
  'channelDelete',
  'channelUpdate',
  'rateLimit',
  'messageReactionAdd',
  'messageReactionRemove',
  'presenceUpdate',
  'emojiCreate',
  'emojiUpdate',
  'emojiDelete',
  'voiceJoin',
  'voiceLeave',
  'memberBoostAdd',
  'memberBoostRemove',
  'memberTimeoutAdd',
  'memberTimeoutRemove',
  'interactionButtonCreate',
  'interactionSelectMenuCreate',
  'interactionCommandCreate',
  'interactionModalCreate',
  'rulesAccept',
  'guildMemberJoin',
  'guildMemberLeave',
  'guildMemberRoleAdd',
  'guildMemberRoleRemove',
  'inviteCreate',
  'inviteDelete',
  'roleCreate',
  'roleDelete',
  'roleUpdate',
  'typingStart',
  'wss',
]

export enum ButtonStyle {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DANGER = 4,
  LINK = 5,
}

export enum CommandArgumentType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
  MENTIONABLE = 9,
  NUMBER = 10,
}

export enum CommandType {
  CHAT_INPUT = 1,
  USER = 2,
  MESSAGE = 3,
}

export type CommandParamsResolvable = StringArgument | NumberArgument | ChoiceArgument

export type ChannelResolvable =
  TextChannel
  | VoiceChannel
  | CategoryChannel
  | StageChannel
  | NewsChannel
  | DMChannel
  | StoreChannel

type ChannelNode<Type extends keyof ChannelOptions> = {
  name: string
  type: Type
  permissionOverwrites?: any[]
  position?: number
  options?: Type extends keyof ChannelOptions
    ? ChannelOptions[Type]
    : never
}

type ChannelOptions = {
  GUILD_TEXT: {
    nsfw?: boolean
    cooldown?: number
    topic?: string
    parentId?: Snowflake
    parent?: CategoryChannel
  },
  GUILD_VOICE: {
    userLimit?: number
    bitrate?: number
    parentId?: Snowflake
    parent?: CategoryChannel
  },
  GUILD_CATEGORY: never,
  GUILD_STAGE_VOICE: {
    userLimit?: number
    bitrate?: number
    parentId?: Snowflake
    parent?: CategoryChannel
  },
}

export type ChannelOptionResolvable = ChannelNode<'GUILD_TEXT'>
  | ChannelNode<'GUILD_VOICE'>
  | ChannelNode<'GUILD_CATEGORY'>
  | ChannelNode<'GUILD_STAGE_VOICE'>

export enum InteractionType {
  PING = 1,
  APPLICATION_COMMAND = 2,
  MESSAGE_COMPONENT = 3,
  APPLICATION_COMMAND_AUTOCOMPLETE = 4,
}

export enum InteractionType {
  PONG = 1,
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
  DEFERRED_UPDATE_MESSAGE = 6,
  UPDATE_MESSAGE = 7,
  APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8,
  MODAL_SUBMIT = 9
}

export enum ComponentType {
  ACTION_ROW = 1,
  BUTTON = 2,
  SELECT_MENU = 3,
  TEXT_INPUT = 4,
}

export interface EmbedField {
  name: string
  value: string
  inline?: boolean
}

export type Hash = {
  omitted: boolean,
  hash: string
}

export type GuildFeature =
  | 'ANIMATED_ICON'
  | 'BANNER'
  | 'COMMERCE'
  | 'COMMUNITY'
  | 'DISCOVERABLE'
  | 'FEATURABLE'
  | 'INVITE_SPLASH'
  | 'MEMBER_VERIFICATION_GATE_ENABLED'
  | 'MONETIZATION_ENABLED'
  | 'MORE_STICKERS'
  | 'NEWS'
  | 'PARTNERED'
  | 'PREVIEW_ENABLED'
  | 'PRIVATE_THREADS'
  | 'ROLE_ICONS'
  | 'SEVEN_DAY_THREAD_ARCHIVE'
  | 'THREE_DAY_THREAD_ARCHIVE'
  | 'TICKETED_EVENTS_ENABLED'
  | 'VANITY_URL'
  | 'VERIFIED'
  | 'VIP_REGIONS'
  | 'WELCOME_SCREEN_ENABLED'

export enum PresenceStatus {
  INACTIVE = 'idle',
  DO_NOT_DISTURB = 'dnd',
  ONLINE = 'online',
  OFFLINE = 'offline',
}

export interface MessageOption {
  content?: string
  embeds?: MessageEmbed[]
  tts?: boolean
  components?: EmbedRow[]
  attachment?: MessageAttachment
  private?: boolean
}

export type RoleOption = {
  label: string
  everyone?: boolean
  color?: keyof typeof Color | string
  permissions?: (keyof typeof PermissionFlag)[]
  display?: boolean
  emoji?: string
  icon?: string
  isMentionable?: boolean
  reason?: string
}

export type RoleUpdateOption = RoleOption & {
  label?: string
}

export type WelcomeChannel = {
  channelId: Snowflake
  description: string
  emojiId?: Snowflake
  emojiName?: string
}

export type WelcomeScreen = {
  description: string
  channels: WelcomeChannel[]
}

export enum OptionType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
  MENTIONABLE = 9,
  NUMBER = 10,
}

export enum CommandOptionType {
  STRING = 3,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
  MENTIONABLE = 9,
  NUMBER = 10,
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type CommandOption<T extends keyof typeof CommandOptionType | 'CHOICE'> = OptionWrapper[T]

interface OptionWrapper {
  STRING: StringOption
  NUMBER: NumberOption
  BOOLEAN: BooleanOption
  CHANNEL: ChannelOption
  CHOICE: ChoiceOption
  USER: UserOption
  ROLE: BaseOption
  MENTIONABLE: BaseOption
}

type BaseOption = {
  name: string
  description: string
  required?: boolean
}

export type StringOption = BaseOption & {
  autocomplete?: boolean
}

export type NumberOption = BaseOption & {
  autocomplete?: boolean
  min?: number
  max?: number
}

export type ChoiceOption = BaseOption & {
  type: 'STRING' | 'NUMBER' | 'BOOLEAN'
  choices: { name: string, value: string | number }[]
}

export type ChannelOption = BaseOption & {
  channelType: (keyof ChannelOptions)[]
  autocomplete?: boolean
}

export type UserOption = BaseOption

export type BooleanOption = BaseOption

export type MenuSelectOption = {
  label: string
  value: unknown
  description?: string
  emoji?: string | Emoji
  default?: boolean
}

export type MenuSelect = {
  customId: string
  placeholder?: string
  minValues?: number
  maxValues?: number
  disabled?: boolean
  choices: MenuSelectOption[]
}

export type EmbedOptions = {
  title?: string | undefined
  description?: string | undefined
  color?: keyof typeof Color | string
  fields?: EmbedField[]
  author?: EmbedAuthor | undefined
  image?: EmbedImage | undefined
  thumbnail?: EmbedThumbnail | undefined
  timestamp?: DateTime | undefined
  video?: EmbedVideo | undefined
  url?: string | undefined
  footer?: EmbedFooter | undefined
}

export enum PermissionType {
  ROLE = 1,
  USER = 2,
}

export enum PermissionFlag {
  CREATE_INSTANT_INVITE = '1 << 0',
  KICK_MEMBERS = '1 << 1',
  BAN_MEMBERS = '1 << 2',
  ADMINISTRATOR = '1 << 3',
  MANAGE_CHANNELS = '1 << 4',
  MANAGE_GUILD = '1 << 5',
  ADD_REACTIONS = '1 << 6',
  VIEW_AUDIT_LOG = '1 << 7',
  PRIORITY_SPEAKER = '1 << 8',
  STREAM = '1 << 9',
  VIEW_CHANNEL = '1 << 10',
  SEND_MESSAGES = '1 << 11',
  SEND_TTS_MESSAGES = '1 << 12',
  MANAGE_MESSAGES = '1 << 13',
  EMBED_LINKS = '1 << 14',
  ATTACH_FILES = '1 << 15',
  READ_MESSAGE_HISTORY = '1 << 16',
  MENTION_EVERYONE = '1 << 17',
  USE_EXTERNAL_EMOJIS = '1 << 18',
  VIEW_GUILD_INSIGHTS = '1 << 19',
  CONNECT = '1 << 20',
  SPEAK = '1 << 21',
  MUTE_MEMBERS = '1 << 22',
  DEAFEN_MEMBERS = '1 << 23',
  MOVE_MEMBERS = '1 << 24',
  USE_VAD = '1 << 25',
  CHANGE_NICKNAME = '1 << 26',
  MANAGE_NICKNAMES = '1 << 27',
  MANAGE_ROLES = '1 << 28',
  MANAGE_WEBHOOKS = '1 << 29',
  MANAGE_EMOJIS_AND_STICKERS = '1 << 30',
  USE_APPLICATION_COMMANDS = '1 << 31',
  REQUEST_TO_SPEAK = '1 << 32',
  MANAGE_EVENTS = '1 << 33',
  MANAGE_THREADS = '1 << 34',
  USE_PUBLIC_THREADS = '1 << 35',
  CREATE_PUBLIC_THREADS = '1 << 35',
  USE_PRIVATE_THREADS = '1 << 36',
  CREATE_PRIVATE_THREADS = '1 << 36',
  USE_EXTERNAL_STICKERS = '1 << 37',
  SEND_MESSAGES_IN_THREADS = '1 << 38',
  START_EMBEDDED_ACTIVITIES = '1 << 39',
  MODERATE_MEMBERS = '1 << 40',
}

export type PruneOption = {
  days?: number
  includeRoles?: Role[] | Snowflake[]
}

export enum InputStyle {
  SHORT = 1,
  LONG = 2,
}

export type InputOption = {
  customId: string
  style: keyof typeof InputStyle
  label: string
  minLength?: number
  maxLength?: number
  required?: boolean
  defaultValue?: string
  placeholder?: string
}

export type ModalComponent<T> = {
  customId: string,
  type: keyof typeof ComponentType,
  value: T
}