import { Snowflake } from '../../types'
import Guild from '../guild/Guild'

export default class Role {
  constructor (
    public id: Snowflake,
    public label: string,
    public unicodeEmoji: string | null,
    public position: number,
    public permissions: string,
    public mentionable: boolean,
    public managed: boolean,
    public icon: any,
    public hoist: boolean,
    public color: number,
    public guild: Guild
  ) {
  }

  public isMentionable (): boolean {
    return this.mentionable
  }

  public isManaged (): boolean {
    return this.managed
  }

  public toString(): string {
    if (this.id === this.guild.id) {
      return '@everyone'
    }
    return `<@&${this.id}>`
  }
}