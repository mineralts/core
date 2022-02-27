import { DateTime } from 'luxon'

export default interface RateLimit {
  readonly url: string
  readonly method: 'GET' | 'POST' | 'PUT' | 'PATH' | 'DELETE'
  readonly global: boolean
  readonly retryAfter: DateTime
}