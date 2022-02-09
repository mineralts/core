/*
 * packages/index.ts
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
import EmbedRow from './embed/EmbedRow'
import SelectMenu from './select-menu'
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
  ClientEvents,
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

export type ChannelResolvable = TextChannel | VoiceChannel | CategoryChannel | StageChannel | NewsChannel | DMChannel | StoreChannel

export {
  Client,
  User,
  ClientEvents,
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
  EmbedRow,
  Button,
  ButtonStyle,
  SelectMenu,
  EmbedThumbnail,
  EmbedAuthor,
  EmbedImage,
  EmbedFooter,
  Reaction,
  CommandOption,
  OptionType,
  CommandInteraction,
  ModalInteraction,
  InteractionType
}