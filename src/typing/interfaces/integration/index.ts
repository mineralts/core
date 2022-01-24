import { BehaviorsExpiration, Snowflake } from '../../../api/types'
import User from '../user'
import { DateTime } from 'luxon'
import IntegrationAccount from './IntegrationAccount'
import IntegrationApplication from './IntegrationApplication'

export default interface Integration {
  readonly id: Snowflake
  readonly name: string
  readonly type: 'twitch' | 'youtube' | 'discord'
  readonly enabled: boolean
  readonly syncing: boolean
  readonly roleId: Snowflake
  readonly enableEmoticons: boolean
  readonly expireBehavior: BehaviorsExpiration
  readonly expireGracePeriod: number
  readonly user: User
  readonly account: IntegrationAccount
  readonly syncedAt: DateTime
  readonly subscriberCount: number
  readonly revoked: boolean
  readonly application: IntegrationApplication

  isEnabled (): boolean
  isSyncing (): boolean
  isEnableEmoticons (): boolean
  isRevoked (): boolean
}