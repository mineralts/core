import { ChannelResolvable, ChannelTypeResolvable, RTC_Region, VideoQuality } from '../../api/types'
import { keyFromEnum } from '../../api/utils'
import StageChannel from '../../api/entities/channels/StageChannel'
import NewsChannel from '../../api/entities/channels/NewsChannel'
import DMChannel from '../../api/entities/channels/DMChannel'
import DmUser from '../../api/entities/user/DmUser'
import StoreChannel from '../../api/entities/channels/StoreChannel'
import Client from '../../api/entities/client'
import Guild from '../../api/entities/guild/Guild'
import TextChannel from '../../api/entities/channels/TextChannel'
import MessageManager from '../../api/entities/message/MessageManager'
import VoiceChannel from '../../api/entities/channels/VoiceChannel'
import CategoryChannel from '../../api/entities/channels/CategoryChannel'
import Ioc from '../../Ioc'
import ThreadChannel from '../../api/entities/channels/ThreadChannel'
import { DateTime } from 'luxon'
import ThreadMemberManager from '../../api/entities/guild/ThreadMemberManager'

export default class ChannelBuilder {
  constructor (private client: Client, private guild: Guild) {
  }

  public build (payload: any): ChannelResolvable {
    const console = Ioc.singleton().resolve('Mineral/Core/Console')
    const channels = {
      [ChannelTypeResolvable.GUILD_TEXT]: () => this.createTextChannel(payload),
      [ChannelTypeResolvable.GUILD_VOICE]: () => this.createVoiceChannel(payload),
      [ChannelTypeResolvable.GUILD_CATEGORY]: () => this.createCategoryChannel(payload),
      [ChannelTypeResolvable.GUILD_STAGE_VOICE]: () => this.createStageChannel(payload),
      [ChannelTypeResolvable.GUILD_NEWS]: () => this.createAnnouncementChannel(payload),
      [ChannelTypeResolvable.DM]: () => this.createDMChannel(payload),
      [ChannelTypeResolvable.GUILD_STORE]: () => this.createStoreChannel(payload),
      [ChannelTypeResolvable.GUILD_PUBLIC_THREAD]: () => this.createThreadChannel(payload),
      [ChannelTypeResolvable.GUILD_PRIVATE_THREAD]: () => this.createThreadChannel(payload),
      unknown: () => {
        console.logger.warning(`Channel not supported : ${payload.type}`)
        return undefined
      }
    }
    return (channels[payload.type] || channels.unknown)()
  }

  private createTextChannel (payload: any) {
    return new TextChannel(
      payload.id,
      payload.name,
      payload.topic,
      this.guild.id,
      this.guild,
      payload.last_message_id,
      // @Todo Get lasted message
      undefined,
      payload.parent_id,
      payload.permission_overwrites,
      payload.position,
      payload.rate_limit_per_user,
      new MessageManager(),
      payload.nsfw,
      undefined
    )
  }

  private createVoiceChannel (payload: any) {
    return new VoiceChannel(
      payload.id,
      payload.name,
      this.guild.id,
      this.guild,
      payload.user_limit,
      keyFromEnum(RTC_Region, payload.rtc_region) as keyof typeof RTC_Region,
      payload.rate_limit_per_user,
      payload.position,
      payload.permission_overwrites,
      payload.parent_id,
      payload.bitrate,
      keyFromEnum(VideoQuality, payload.video_quality_mode) as keyof typeof VideoQuality,
      undefined
    )
  }

  private createCategoryChannel (payload: any) {
    return new CategoryChannel(
      payload.id,
      payload.position,
      payload.name,
      this.guild.id,
      this.guild
    )
  }

  private createStageChannel (payload: any) {
    return new StageChannel(
      payload.id,
      payload.name,
      payload.topic,
      this.guild.id,
      this.guild,
      payload.user_limit,
      payload.rtc_region,
      payload.position,
      0,
      payload.position,
      payload.permission_overwrites,
      payload.parent_id,
      this.guild.channels.cache.get(payload.parent_id)
    )
  }


  private createAnnouncementChannel (payload: any) {
    return new NewsChannel(
      payload.id,
      payload.name,
      undefined,
      this.guild.id,
      this.guild,
      payload.last_message_id,
      undefined,
      payload.parent_id,
      payload.permission_overwrites,
      payload.position,
      undefined,
      payload.topic,
      new MessageManager(),
      this.guild.channels.cache.get(payload.parent_id)
    )
  }

  private createDMChannel (payload: any) {
    return new DMChannel(
      payload.id,
      payload.last_message_id,
      payload.recipients.map((user) => new DmUser(
        user.id,
        user.public_flags,
        user.username,
        user.discriminator,
        user.avatar
      ))
    )
  }

  private createStoreChannel (payload: any) {
    return new StoreChannel(
      payload.id,
      payload.name,
      payload.guild_id,
      this.guild,
      payload.position,
      payload.parent_id,
      payload.nsfw,
      payload.permission_overwrites,
      this.guild.channels.cache.get(payload.parent_id)
    )
  }

  private async createThreadChannel (payload: any) {
    const owner = this.guild.members.cache.get(payload.owner_id) || this.guild.bots.cache.get(payload.owner_id)

    return new ThreadChannel(
      payload.id,
      keyFromEnum(ChannelTypeResolvable, payload.type),
      payload.name,
      undefined,
      payload.guild_id,
      this.guild,
      payload.last_message_id,
      undefined,
      payload.parent_id,
      this.guild.channels.cache.get(payload.parent_id),
      undefined,
      payload.rate_limit_per_user,
      new MessageManager(),
      payload.thread_metadata.locked,
      payload.thread_metadata.archived,
      DateTime.fromISO(payload.thread_metadata.create_timestamp),
      DateTime.fromISO(payload.thread_metadata.archive_timestamp),
      payload.thread_metadata.auto_archive_duration,
      payload.owner_id,
      owner,
      payload.message_count,
      payload.member_count,
      new ThreadMemberManager()
    )
  }
}