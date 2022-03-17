import { Snowflake } from '../../types'
import Guild from '../guild/Guild'
import TextChannelResolvable from './TextChannelResolvable'
import { DateTime } from 'luxon'
import CategoryChannel from './CategoryChannel'
import Message from '../message'
import MessageManager from '../message/MessageManager'

export default class TextChannel extends TextChannelResolvable {
  constructor (
    id: Snowflake,
    name: string,
    description: string | undefined,
    guildId: Snowflake,
    guild: Guild,
    lastMessageId: Snowflake,
    lastMessage: Message | undefined,
    parentId: Snowflake | undefined,
    permissionOverwrites: { [K: string]: string }[] | undefined,
    position: number | undefined,
    cooldown: DateTime | undefined,
    messages: MessageManager,
    isNsfw: boolean,
    parent?: CategoryChannel,
  ) {
    super(id, 'GUILD_TEXT', name, description, guildId, guild, lastMessageId, lastMessage, parentId, permissionOverwrites, position, cooldown, messages, isNsfw, parent)
    this.createMessageManager(new MessageManager(this))
  }
}