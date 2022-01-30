import { Snowflake } from '../../types'
import Role from '../roles'

export default class Emoji {
  constructor (
    public id: Snowflake,
    public label: string,
    public managed: boolean,
    public available: boolean,
    public animated: boolean = false,
    public roles: Role[] = []
  ) {
  }

  public toString (): string {
    return this.id
      ? `<${this.animated ? 'a' : ''}:${this.label}:${this.id}>`
      : this.label
  }
}