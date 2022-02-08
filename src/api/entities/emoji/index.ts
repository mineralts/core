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

  public async delete (reason?: string) {
    const request = Application.createRequest()

    if (reason) {
      request.defineHeaders({
        'X-Audit-Log-Reason': reason
      })
    }

    await request.delete(`/guilds/${this.guild?.id}/emojis/${this.id}`)
    request.resetHeaders('X-Audit-Log-Reason')
  }

  public toString (): string {
    return this.id
      ? `<${this.animated ? 'a' : ''}:${this.label}:${this.id}>`
      : this.label
  }
}