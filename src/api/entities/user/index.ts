import { DateTime } from 'luxon'
import { Snowflake } from '../../types'
import Presence from '../presence'
import Application from '../../../application/Application'
import UserFlags from './UserFlags'

export default class User {
  constructor (
    public id: Snowflake,
    public username: string,
    public discriminator: string,
    public tag: string,
    public bot: boolean,
    public premiumSince: DateTime | undefined,
    public verified: boolean,
    public mfaEnabled: boolean,
    public publicFlags: UserFlags,
    public email: string | null,
    public avatar: string | null,
    public banner: string | null,
    public presence: Presence | undefined,
  ) {
  }

  public isBot (): boolean {
    return this.bot
  }

  public isVerified (): boolean {
    return this.verified
  }

  public hasMfaEnabled (): boolean {
    return this.mfaEnabled
  }

  public getAvatarUrl (format = 'webp', size?, dynamic = false): string | null {
    format = dynamic && this.avatar?.startsWith('a_') ? 'gif' : format
    return this.avatar
      ? this.makeImageUrl(`${Application.cdn}/avatars/${this.id}/${this.avatar}`, { format, size })
      : null
  }

  public getDefaultAvatarUrl (): string {
    return `${Application.cdn}/embed/avatars/${this.discriminator}.png`
  }

  public async getBannerUrl (format = 'webp', size?, dynamic = false): Promise<string | null> {
    if (dynamic) format = this.avatar?.startsWith('a_') ? 'gif' : format
    return this.avatar
      ? this.makeImageUrl(`${Application.cdn}/banners/${this.id}/${this.banner}`, { format, size })
      : null
  }

  protected makeImageUrl (root, { format = 'webp', size = 256 }: { format?: any; size?: any } = {}) {
    return `${root}.${format}${size ? `?size=${size}` : ''}`
  }

  public toString(): string {
    return `<@${this.id}>`
  }
}