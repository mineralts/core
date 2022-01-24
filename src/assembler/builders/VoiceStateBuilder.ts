import { Client, Guild, GuildMember, VoiceState, VoiceChannel } from '../../api/entities'

export default class VoiceStateBuilder {
  constructor (
    private client: Client,
    private readonly guild: Guild,
    private readonly member: GuildMember,
    private readonly voiceChannel: VoiceChannel
  ) {
  }

  public build (payload: any) {
    return new VoiceState(
      this.member,
      payload.session_id,
      payload.suppress,
      payload.self_video,
      payload.mute,
      payload.self_deaf,
      payload.channel_id,
      this.voiceChannel,
      this.guild
    )
  }
}