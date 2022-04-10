import { ChannelTypeResolvable, Snowflake } from '../../types'
import Guild from '../guild/Guild'
import { DateTime } from 'luxon'
import CategoryChannel from './CategoryChannel'
import Message from '../message'
import MessageManager from '../message/MessageManager'
import TextChannel from './TextChannel'
import GuildMember from '../guild/GuildMember'
import ThreadMemberManager from '../guild/ThreadMemberManager'
import Ioc from '../../../Ioc'
import ThreadMember from '../guild/ThreadMember'

export default class ThreadChannel extends TextChannel {
  constructor (
    id: Snowflake,
    public type: keyof typeof ChannelTypeResolvable,
    name: string,
    description: string | undefined,
    guildId: Snowflake,
    guild: Guild,
    lastMessageId: Snowflake,
    lastMessage: Message | undefined,
    parentId: Snowflake | undefined,
    parent: CategoryChannel | undefined,
    permissionOverwrites: { [K: string]: string }[] | undefined,
    cooldown: DateTime | undefined,
    messages: MessageManager,
    public isLocked: boolean,
    public isArchived: boolean,
    public createdAt: DateTime,
    public archivedAt: DateTime,
    public autoArchiveDuration: number,
    public ownerId: Snowflake,
    public owner: GuildMember | undefined,
    public messageCount: number,
    public memberCount: number,
    public members: ThreadMemberManager
  ) {
    super(id, name, description, guildId, guild, lastMessageId, lastMessage, parentId, permissionOverwrites, undefined, cooldown, messages, false, parent)
  }

  public isPrivateThread () {
    return this.type === 'GUILD_PRIVATE_THREAD'
  }

  public isPublicThread () {
    return this.type === 'GUILD_PUBLIC_THREAD'
  }

  public async loadMembers () {
    const request = Ioc.singleton().resolve('Mineral/Core/Http')

    const { data: members } = await request.get(`/channels/${this.id}/thread-members`)

    members.forEach((payload) => {
      const member = this.guild?.members.cache.get(payload.user_id) || this.guild?.bots.cache.get(payload.user_id)
      const threadMember = new ThreadMember(member!, DateTime.fromISO(payload.join_timestamp))

      this.members.cache.set(threadMember.member.id, threadMember)
    })
  }
}