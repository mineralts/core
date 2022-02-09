import { Snowflake } from '../../types'
import Guild from '../guild/Guild'
import Application from '../../../application/Application'

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

  public async delete (reason?: string): Promise<void> {
    const request = Application.createRequest()

    if (reason) {
      request.defineHeaders({
        'X-Audit-Log-Reason': reason
      })
    }

    await request.delete(`/guilds/${this.guild.id}/roles/${this.id}`)
    request.resetHeaders('X-Audit-Log-Reason')
  }

  public toString(): string {
    if (this.id === this.guild.id) {
      return '@everyone'
    }
    return `<@&${this.id}>`
  }
}