import Channel from './Channel'
import { RTC_Region } from '../../../api/types'

export default interface StageChannel extends Channel {
  readonly topic: string | undefined,
  readonly maxUser: number,
  readonly region: keyof typeof RTC_Region,
  readonly rateLimitPerUser: number,
  readonly permission: any[],
  readonly bitrate: number,
}