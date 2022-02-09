import { PermissionFlag, RoleUpdateOption, Snowflake } from '../../types'
import Guild from '../guild/Guild'
import Application from '../../../application/Application'
import { resolveColor } from '../../utils'
import { Color } from '../index'
import { join } from 'path'
import fs from 'fs'

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

  public async update (options: RoleUpdateOption) {
    const logger = Application.getLogger()
    const payload = {
      name: options.label,
      permissions: options.permissions?.reduce((acc: number, current: keyof typeof PermissionFlag) => acc + parseInt(PermissionFlag[current]), 0),
      hoist: options.display || false,
      mentionable: options.isMentionable || false
    }

    if (options.color) {
      payload['color'] = resolveColor(
        !options.color.startsWith('#')
          ? Color[options.color]
          : options.color
      )
    }

    if (options.icon) {
      if (!this.guild.hasFeature('ROLE_ICONS') && options.icon) {
        logger.error('You must have the `ROLE_ICONS` feature in order to define a role icon')
        return
      }

      const filePath = join(process.cwd(), options.icon)
      const file = await fs.promises.readFile(filePath, 'base64')

      payload['icon'] = `data:image/png;base64,${file}`
    }

    if (options.emoji) {
      if (!this.guild.hasFeature('ROLE_ICONS') && options.icon) {
        logger.error('You must have the `ROLE_ICONS` feature in order to define a role icon')
        return
      }

      payload['unicode_emoji'] = options.emoji
    }

    const request = Application.createRequest()

    if (options.reason) {
      request.defineHeaders({
        'X-Audit-Log-Reason': options.reason
      })
    }

    await request.patch(`/guilds/${this.guild.id}/roles/${this.id}`, payload)
    request.resetHeaders('X-Audit-Log-Reason')

    return this
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

  public async setPosition (position: number, reason?: string): Promise<void> {
    const request = Application.createRequest()

    if (reason) {
      request.defineHeaders({
        'X-Audit-Log-Reason': reason
      })
    }

    await request.patch(`/guilds/${this.guild.id}/roles`, [{
      id: this.id,
      position
    }])

    request.resetHeaders('X-Audit-Log-Reason')
  }

  public toString(): string {
    if (this.id === this.guild.id) {
      return '@everyone'
    }
    return `<@&${this.id}>`
  }
}