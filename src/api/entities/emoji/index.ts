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

  public async update (options: { label: string, roles?: Role[] | Snowflake[], reason?: string }) {
    const request = Application.singleton().resolveBinding('Mineral/Core/Http')

    if (options.reason) {
      request.defineHeaders({
        'X-Audit-Log-Reason': options.reason
      })
    }

    await request.patch(`/guilds/${this.guild?.id}/emojis/${this.id}`, {
      name: options.label,
      roles: options.roles
        ? options.roles.map((role: Role | Snowflake) => role instanceof Role ? role.id : role)
        : []
    })

    request.resetHeaders('X-Audit-Log-Reason')
  }

  public async delete (reason?: string) {
    const request = Application.singleton().resolveBinding('Mineral/Core/Http')

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