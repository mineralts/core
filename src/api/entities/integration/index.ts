import { BehaviorsExpiration, Snowflake } from '../../types'
import User from '../user'
import { DateTime } from 'luxon'
import IntegrationAccount from './IntegrationAccount'
import IntegrationApplication from './IntegrationApplication'

export default class Integration {
  constructor (
    public id: Snowflake,
    public name: string,
    public type: 'twitch' | 'youtube' | 'discord',
    public enabled: boolean,
    public syncing: boolean,
    public roleId: Snowflake,
    public enableEmoticons: boolean,
    public expireBehavior: BehaviorsExpiration,
    public expireGracePeriod: number,
    public user: User,
    public account: IntegrationAccount,
    public syncedAt: DateTime,
    public subscriberCount: number,
    public revoked: boolean,
    public application: IntegrationApplication,
  ) {
  }

  public isEnabled (): boolean {
    return this.enabled
  }

  public isSyncing (): boolean {
    return this.syncing
  }

  public isEnableEmoticons (): boolean {
    return this.enableEmoticons
  }

  public isRevoked (): boolean {
    return this.revoked
  }
}