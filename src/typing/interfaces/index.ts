/*
 * packages/WebSocketManager.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import Client from './client'
import User from './user'
import GuildMember from './guild/GuildMember'
import Guild from './guild/Guild'
import Presence from './presence'
import Role from './roles'
import Emoji from './emoji'
import GuildRoleManager from './guild/GuildRoleManager'
import GuildChannelManager from './guild/GuildChannelManager'
import GuildMemberManager from './guild/GuildMemberManager'
import GuildEmojiManager from './guild/GuildEmojiManager'
import InviteManager from './invitation/InviteManager'
import GuildMemberRoleManager from './guild/GuildMemberRoleManager'
import VoiceState from './voice/VoiceState'
import Activity from './activity'
import TextChannel from './channels/TextChannel'
import VoiceChannel from './channels/VoiceChannel'
import CategoryChannel from './channels/CategoryChannel'
import TextChannelResolvable from './channels/TextChannelResolvable'
import MessageManager from './message/MessageManager'
import Channel from './channels/Channel'
import GuildManager from './guild/GuildManager'
import Invite from './invitation/Invite'
import Message from './message'
import MentionResolvable from './mention/MentionResolvable'
import MessageAttachment from './message/MessageAttachment'
import Button from './button'
import EmbedAuthor from './embed/EmbedAuthor'
import EmbedThumbnail from './embed/EmbedThumbnail'
import EmbedImage from './embed/EmbedImage'
import EmbedFooter from './embed/EmbedFooter'
import Reaction from './reaction/Reaction'
import CommandInteraction from './interaction/CommandInteraction'
import ModalInteraction from './interaction/ModalInteraction'
import {
  ActivityType,
  ButtonStyle,
  ChannelTypeResolvable,
  clientEvents,
  CommandOption,
  ComponentType,
  InteractionType,
  OptionType,
  PresenceStatus,
  Region,
  RTC_Region,
  Snowflake,
  VideoQuality
} from '../../api/types'
import StageChannel from '../../typing/interfaces/channels/StageChannel'
import NewsChannel from '../../typing/interfaces/channels/NewsChannel'
import DMChannel from '../../typing/interfaces/channels/DMChannel'
import StoreChannel from '../../typing/interfaces/channels/StoreChannel'
import Collection from '../../api/utils/Collection'
import { WebsocketPayload } from '@mineralts/connector-preview'
import RateLimit from './rateLimit'
import HttpRequest from './http'
import ThreadChannel from './channels/ThreadChannel'
import ButtonInteraction from './interaction/ButtonInteraction'
import MenuInteraction from './interaction/MenuInteraction'
import SelectMenuInteraction from './interaction/SelectMenuInteraction'

export type ChannelResolvable = TextChannel | VoiceChannel | CategoryChannel | StageChannel | NewsChannel | DMChannel | StoreChannel
export type OnlyKeys<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];

export {
  Client,
  User,
  clientEvents,
  Snowflake,
  GuildMember,
  Guild,
  Presence,
  Role,
  Emoji,
  Channel,
  TextChannel,
  VoiceChannel,
  CategoryChannel,
  TextChannelResolvable,
  Region,
  GuildRoleManager,
  GuildChannelManager,
  GuildMemberManager,
  GuildEmojiManager,
  GuildMemberRoleManager,
  InviteManager,
  VoiceState,
  PresenceStatus,
  Activity,
  ActivityType,
  MessageManager,
  ChannelTypeResolvable,
  RTC_Region,
  VideoQuality,
  GuildManager,
  Invite,
  Message,
  MentionResolvable,
  MessageAttachment,
  ComponentType,
  Button,
  ButtonStyle,
  EmbedThumbnail,
  EmbedAuthor,
  EmbedImage,
  EmbedFooter,
  Reaction,
  CommandOption,
  OptionType,
  CommandInteraction,
  ModalInteraction,
  InteractionType,
  RateLimit,
  HttpRequest,
  ThreadChannel,
  MenuInteraction,
  SelectMenuInteraction,
}

export interface ClientEvents {
  ready: [client: Client],
  rateLimit: [limit: RateLimit]
  http: [httpRequest: HttpRequest]

  'create:Guild': [guild: Guild]
  'update:Guild': [before: Omit<Guild, OnlyKeys<Guild>>, after: Guild]
  'delete:Guild': [guild: Guild]

  'create:Message': [message: Message],
  'update:Message': [before: Message | undefined, after: Message]
  'delete:Message': [message: Message]
  'pin:Message': [message:Message]
  'unpin:Message': [message: Message]


  'create:Channel': [channel: Channel]
  'update:Channel': [channel: Channel]
  'delete:Channel': [channel: Channel]

  'create:ThreadChannel': [channel: ThreadChannel]
  'update:ThreadChannel': [channel: ThreadChannel]
  'delete:ThreadChannel': [channel: ThreadChannel]

  'create:TextChannel': [channel: TextChannel]
  'update:TextChannel': [channel: TextChannel]
  'delete:TextChannel': [channel: TextChannel]

  'create:DmChannel': [channel: DMChannel]
  'update:DmChannel': [channel: DMChannel]
  'delete:DmChannel': [channel: DMChannel]

  'create:VoiceChannel': [channel: VoiceChannel]
  'update:VoiceChannel': [channel: VoiceChannel]
  'delete:VoiceChannel': [channel: VoiceChannel]

  'create:StageChannel': [channel: StageChannel]
  'update:StageChannel': [channel: StageChannel]
  'delete:StageChannel': [channel: StageChannel]

  'create:NewsChannel': [channel: NewsChannel]
  'update:NewsChannel': [channel: NewsChannel]
  'delete:NewsChannel': [channel: NewsChannel]

  'create:CategoryChannel': [channel: CategoryChannel]
  'update:CategoryChannel': [channel: CategoryChannel]
  'delete:CategoryChannel': [channel: CategoryChannel]

  'add:MessageReaction': [message: Message, reaction: Reaction]
  'remove:MessageReaction': [message: Message, reaction: Reaction]

  'update:Presence': [before: Presence | undefined, after: Presence]

  'create:Emoji': [emoji: Emoji]
  'update:Emoji': [before: Emoji, after: Emoji]
  'delete:Emoji': [emoji: Emoji]

  'join:VoiceMember': [member: GuildMember]
  'leave:VoiceMember': [member: GuildMember]
  'update:VoiceState': [before: VoiceState | undefined, after: VoiceState]

  'add:MemberMute': [member: GuildMember]
  'update:Member': [before: GuildMember, after: GuildMember]
  'remove:MemberMute': [member: GuildMember]

  'add:MemberBoost': [member: GuildMember]
  'remove:MemberBoost': [member: GuildMember]

  'add:MemberTimeout': [member: GuildMember, duration: number]
  'remove:MemberTimeout': [member: GuildMember]

  'accept:Rules': [member: GuildMember]

  'join:Member': [member: GuildMember, invitation?: Invite]
  'leave:Member': [member: GuildMember]

  'add:MemberRole': [member: GuildMember, before: Collection<Snowflake, Role>, after: Collection<Snowflake, Role>]
  'remove:MemberRole': [member: GuildMember, before: Collection<Snowflake, Role>, after: Collection<Snowflake, Role>]

  'create:Invite': [invite: Invite]
  'delete:Invite': [invite: Invite]

  'create:Role': [role: Role]
  'update:Role': [before: Role, after: Role]
  'delete:Role': [role: Role]

  'open:modal': [interaction: ModalInteraction]
  [event: `open:modal::${string}`]: [interaction: ModalInteraction]

  'press:button': [interaction: ButtonInteraction]
  [event: `press:button::${string}`]: [interaction: ButtonInteraction]

  'use:command': [interaction: CommandInteraction]
  [event: `use:command::${string}`]: [interaction: CommandInteraction]

  'select:menu': [interaction: SelectMenuInteraction]
  [event: `select:menu::${string}`]: [interaction: SelectMenuInteraction]

  'action:context': [interaction: MenuInteraction]

  'start:typing': [member: GuildMember, channel: TextChannelResolvable]
  'wss': [payload: WebsocketPayload]
}