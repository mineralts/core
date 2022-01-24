import { DateTime } from 'luxon'

export default interface RateLimit {
  readonly message: string
  readonly retryAfter: DateTime
  readonly global: boolean

  isGlobal (): boolean
}