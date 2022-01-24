import {
  CategoryChannel,
  ChannelResolvable,
  ChannelTypeResolvable,
  Client,
  Guild,
  MessageManager,
  RTC_Region,
  TextChannel,
  VideoQuality,
  VoiceChannel
} from '../../api/entities'
import Logger from '@mineralts/logger'
import { keyFromEnum } from '../../api/utils'
import StageChannel from '../../api/entities/channels/StageChannel'
import NewsChannel from '../../api/entities/channels/NewsChannel'
import DMChannel from '../../api/entities/channels/DMChannel'
import DmUser from '../../api/entities/user/DmUser'
import StoreChannel from '../../api/entities/channels/StoreChannel'

export default class ChannelBuilder {
  constructor (private client: Client, private logger: Logger, private guild: Guild) {
  }

  public build (payload: any): ChannelResolvable {
    const channels = {
      [ChannelTypeResolvable.GUILD_TEXT]: () => this.createTextChannel(payload),
      [ChannelTypeResolvable.GUILD_VOICE]: () => this.createVoiceChannel(payload),
      [ChannelTypeResolvable.GUILD_CATEGORY]: () => this.createCategoryChannel(payload),
      [ChannelTypeResolvable.GUILD_STAGE_VOICE]: () => this.createStageChannel(payload),
      [ChannelTypeResolvable.GUILD_NEWS]: () => this.createAnnouncementChannel(payload),
      [ChannelTypeResolvable.DM]: () => this.createDMChannel(payload),
      [ChannelTypeResolvable.GUILD_STORE]: () => this.createStoreChannel(payload),
      unknown: () => {
        this.logger.warn(`Channel not supported : ${payload.type}`)
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
      this.guild.channels.cache.get(payload.parent_id),
    )
  }
}