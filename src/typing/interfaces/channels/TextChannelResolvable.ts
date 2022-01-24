import { MessageOption, Milliseconds, Snowflake } from '../../../api/types'
import Channel from './Channel'
import { DateTime } from 'luxon'
import Message from '../message'
import MessageManager from '../message/MessageManager'

export default interface TextChannelResolvable extends Channel {
  readonly description: string | undefined
  readonly lastMessageId: Snowflake
  readonly lastMessage: Message | undefined
  readonly permissionOverwrites: { [K: string]: string }[]
  readonly cooldown: DateTime
  readonly messages: MessageManager
  readonly isNsfw: boolean

  setCooldown (value: Milliseconds): Promise<void>
  setDescription (value: string | null): Promise<void>
  isNSFW (): boolean
  setNSFW (bool: boolean): boolean
  send (messageOption: Omit<MessageOption, 'private'>): Promise<void>
}