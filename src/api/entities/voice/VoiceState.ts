import { Snowflake } from '../../types'
import GuildMember from '../guild/GuildMember'
import VoiceChannel from '../channels/VoiceChannel'
import Guild from '../guild/Guild'
import Application from '../../../application/Application'

export default class VoiceState {
  constructor (
    public member: GuildMember,
    public sessionId: string,
    public suppress: boolean,
    public video: boolean,
    public mute: boolean,
    public deaf: boolean,
    public channelId: Snowflake,
    public channel: VoiceChannel | undefined,
    public guild: Guild,
  ) {
  }

  public isSuppress (): boolean {
    return this.suppress
  }

  public hasVideo (): boolean {
    return this.video
  }

  public isMute (): boolean {
    return this.mute
  }

  public isDeaf (): boolean {
    return this.deaf
  }

  public async setMute(value: boolean) {
    const request = Application.createRequest()
    await request.patch(`/guilds/${this.guild.id}/members/${this.member.id}`, {
      mute: value
    })

    this.mute = value
  }

  public async setDeaf(value: boolean) {
    const request = Application.createRequest()
    await request.patch(`/guilds/${this.guild.id}/members/${this.member.id}`, {
      deaf: value
    })

    this.deaf = value
  }

  public async move(channel: VoiceChannel | Snowflake) {
    const request = Application.createRequest()
    await request.patch(`/guilds/${this.guild.id}/members/${this.member.id}`, {
      channel_id: typeof channel === 'string'
        ? channel
        : channel.id
    })

    this.channel = typeof channel === 'string' ?
      this.guild.channels.cache.get(channel)
      : channel
  }
}