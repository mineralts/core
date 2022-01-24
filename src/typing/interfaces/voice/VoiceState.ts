import { Snowflake } from '../../../api/types'
import GuildMember from '../guild/GuildMember'
import VoiceChannel from '../channels/VoiceChannel'
import Guild from '../guild/Guild'

export default interface VoiceState {
  readonly member: GuildMember
  readonly sessionId: string
  readonly suppress: boolean
  readonly video: boolean
  readonly mute: boolean
  readonly deaf: boolean
  readonly channelId: Snowflake
  readonly channel: VoiceChannel | undefined
  readonly guild: Guild

  isSuppress (): boolean
  hasVideo (): boolean
  isMute (): boolean
  isDeaf (): boolean
  setMute(value: boolean): Promise<void>
  setDeaf(value: boolean): Promise<void>
  move(channel: VoiceChannel | Snowflake): Promise<void>
}