import Collection from '../../utils/Collection'
import { PermissionFlag, RoleOption, Snowflake } from '../../types'
import Role from '../roles'
import Guild from './Guild'
import Application from '../../../application/Application'
import { Color } from '../index'
import { join } from 'path'
import fs from 'fs'
import { RoleBuilder } from '../../../assembler/builders'
import { resolveColor } from '../../utils'

export default class GuildRoleManager {
  public cache: Collection<Snowflake, Role> = new Collection()

  constructor (private guild: Guild) {
  }


  public register (roles: Collection<Snowflake, Role>) {
    roles.forEach((role: Role) => {
      this.cache.set(role.id, role)
    })
    return this
  }

  public async create (options: RoleOption) {
    const logger = Application.getLogger()
    const payload = {
      name: options.label,
      permissions: options.permissions?.reduce((acc: number, current: keyof typeof PermissionFlag) => acc + PermissionFlag[current], 0),
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
    const data = await request.post(`/guilds/${this.guild.id}/roles`, payload)

    const roleBuilder = new RoleBuilder()
    return roleBuilder.build({
      ...data,
      guild: this.guild
    })
  }
}