import { RTC_Region, VideoQuality } from '../../../api/types'
import Channel from './Channel'

export default interface VoiceChannel extends Channel {
  readonly maxUser: number
  readonly region: keyof typeof RTC_Region
  readonly rateLimitPerUser: number
  readonly permission: any[]
  readonly bitrate: number
  readonly videoQuality: keyof typeof VideoQuality

  setBitrate (value: number): Promise<void>
  setRtcRegion (region: keyof typeof RTC_Region): Promise<void>
  setMaxMember (value: number | 'UNLIMITED'): Promise<void>
  setVideoQuality (quality: keyof typeof VideoQuality): Promise<void>
}