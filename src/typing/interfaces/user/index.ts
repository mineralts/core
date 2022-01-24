import { DateTime } from 'luxon'
import Presence from '../presence'
import { Snowflake } from '../../../api/types'

export default interface User {
  readonly id: Snowflake
  readonly username: string
  readonly discriminator: string
  readonly tag: string
  readonly bot: boolean
  readonly premiumSince: DateTime | undefined
  readonly verified: boolean
  readonly mfaEnabled: boolean
  readonly flags: number
  readonly email: string | null
  readonly avatar: string | null
  readonly banner: string | null
  readonly presence: Presence | undefined

  isBot (): boolean
  isVerified (): boolean
  hasMfaEnabled (): boolean
  getAvatarUrl (format: string, size?, dynamic?: boolean): string | null
  getDefaultAvatarUrl (): string
  getBannerUrl (format: string, size?, dynamic?: boolean): Promise<string | null>
  makeImageUrl (root, { format, size }: { format?: any; size?: any })
}