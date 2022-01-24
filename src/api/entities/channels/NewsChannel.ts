import { Snowflake } from '../../types'
import Guild from '../guild/Guild'
import CategoryChannel from './CategoryChannel'
import Message from '../message'
import MessageManager from '../message/MessageManager'
import { DateTime } from 'luxon'
import Channel from './Channel'

export default class NewsChannel extends Channel {
  constructor (
    id: Snowflake,
    name: string,
    description: string | undefined,
    guildId: Snowflake,
    guild: Guild,
    lastMessageId: Snowflake,
    lastMessage: Message | undefined,
    parentId: Snowflake,
    permissionOverwrites: { [K: string]: string }[],
    position: number,
    rateLimitePerUser: DateTime | undefined,
    topic: string,
    messages: MessageManager,
    parent?: CategoryChannel,
  ) {
    super(id, 'GUILD_NEWS', name, guildId, guild, parentId, position, parent)
  }
}