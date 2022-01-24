import { MessageOption, Snowflake } from '../../../api/types'
import { DateTime } from 'luxon'
import GuildMember from '../guild/GuildMember'
import Guild from '../guild/Guild'
import TextChannel from '../channels/TextChannel'
import Emoji from '../emoji'
import MessageAttachment from './MessageAttachment'
import ReactionManager from '../reaction/ReactionManager'
import MessageEmbed from '../embed/MessageEmbed'
import MentionResolvable from '../mention/MentionResolvable'

export default interface Message {
  readonly reactions: ReactionManager
  readonly id: Snowflake
  readonly type: number
  readonly flags: string[]
  readonly tts: boolean
  readonly createdAt: DateTime | null
  readonly updatedAt: DateTime | null
  readonly referencedMessage: Message | null | undefined
  readonly pinned: boolean
  readonly mentions: MentionResolvable
  readonly author: GuildMember | undefined
  readonly guild: Guild | undefined
  readonly channel: TextChannel
  readonly content: string
  readonly attachment: MessageAttachment
  readonly components: any[]
  readonly embeds: MessageEmbed[]

  isTTS (): boolean
  isPinned (): boolean
  crossPost (): Promise<void>
  pin (): Promise<void>
  unPin (): Promise<void>
  delete (): Promise<void>
  edit (message: MessageOption): Promise<void>
  reload (): Promise<void>
  react (emoji: string | Emoji): Promise<void>
}