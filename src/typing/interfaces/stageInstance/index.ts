import { Snowflake } from '../../../api/types'

export default interface StageInstance {
  readonly id: Snowflake
  readonly guildId: Snowflake
  readonly channelId: Snowflake
  readonly topic: string
  readonly privacyLevel: number
  readonly discoverableDisabled: boolean

  isDiscoverableDisabled (): boolean
}