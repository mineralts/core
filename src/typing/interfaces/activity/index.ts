import { DateTime } from 'luxon'
import { ActivityAssets, ActivityTimestamps, ActivityType, Snowflake } from '../../../api/types'
import Emoji from '../emoji'

export default interface Activity {
  readonly id: string
  readonly type: keyof ActivityType
  readonly description: string
  readonly name: string
  readonly emoji: Emoji | undefined
  readonly timestamps: ActivityTimestamps
  readonly state: string | undefined
  readonly detail: string | undefined
  readonly assets: ActivityAssets
  readonly buttons: string[]
  readonly syncId: string | undefined
  readonly sessionId: string | undefined
  readonly createdAt: DateTime
  readonly applicationId: Snowflake | undefined
}