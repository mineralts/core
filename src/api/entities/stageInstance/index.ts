import { Snowflake } from '../../types'

export default class StageInstance {
  constructor (
    public id: Snowflake,
    public guildId: Snowflake,
    public channelId: Snowflake,
    public topic: string,
    public privacyLevel: number,
    public discoverableDisabled: boolean,
  ) {
  }

  public isDiscoverableDisabled (): boolean {
    return this.discoverableDisabled
  }
}