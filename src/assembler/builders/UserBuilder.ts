import { DateTime } from 'luxon'
import UserFlags from '../../api/entities/user/UserFlags'
import { FlagIdentifier, FlagLabel } from '../../api/types'
import Client from '../../api/entities/client'
import User from '../../api/entities/user'

export class UserBuilder {
  constructor (private client: Client, private readonly payload: any) {
  }

  public build () {
    const flag = new UserFlags(
      FlagIdentifier[this.payload.public_flags || 0],
      FlagLabel[this.payload.public_flags || 0],
      this.payload.public_flags ||0
    )

    return new User(
      this.payload.id,
      this.payload.username,
      this.payload.discriminator,
      `${this.payload.username}#${this.payload.discriminator}`,
      this.payload.bot === true,
      this.payload.premium_since
        ? DateTime.fromISO(this.payload.premium_since)
        : undefined,
      this.payload.verified,
      this.payload.mfa_enabled === true,
      flag,
      this.payload.email,
      this.payload.avatar,
      this.payload.banner,
      undefined,
    )
  }
}