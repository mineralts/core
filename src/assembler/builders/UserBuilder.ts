import { Client, User } from '../../api/entities'
import { DateTime } from 'luxon'

export class UserBuilder {
  constructor (private client: Client, private readonly payload: any) {
  }

  public build () {
    return new User(
      this.payload.id,
      this.payload.username,
      this.payload.discriminator,
      `${this.payload.username}#${this.payload.discriminator}`,
      this.payload.bot === true,
      this.payload.premium_since
        ? DateTime.fromISO(this.payload.premium_since)
        : undefined,
      this.payload.verified === true,
      this.payload.mfa_enabled === true,
      this.payload.public_flags,
      this.payload.email,
      this.payload.avatar,
      this.payload.banner,
      undefined,
    )
  }
}