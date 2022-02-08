import { Snowflake } from '../../types'
import Role from '../roles'
import Application from '../../../application/Application'
import Guild from '../guild/Guild'

export default class Emoji {
  constructor (
    public id: Snowflake,
    public guild: Guild | undefined,
    public label: string,
    public managed: boolean,
    public available: boolean,
    public animated: boolean = false,
    public roles: Role[] = []
  ) {
  }

  public async delete () {
    const request = Application.createRequest()
    console.log(this.guild?.id)
    await request.delete(`/guilds/${this.guild?.id}/emojis/${this.id}`)
  }

  public toString (): string {
    return this.id
      ? `<${this.animated ? 'a' : ''}:${this.label}:${this.id}>`
      : this.label
  }
}