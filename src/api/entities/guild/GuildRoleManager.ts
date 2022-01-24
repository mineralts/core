import Collection from '../../utils/Collection'
import { RoleOption, Snowflake } from '../../types'
import Role from '../roles'
import Guild from './Guild'

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
    // if (!this.guild.hasFeature('ANIMATED_ICON') && options.icon) {
    //   const logger = Application.getLogger()
    //   logger.error('You must have the `` feature in order to define a role icon')
    // }
    //
    // const payload = {
    //   name: options.name,
    //   permissions: options.everyone,
    //   color: Color[options.color] || options.color,
    //   hoist: options.hoist || false,
    //   icon: `data:image/png;base64,${file}`
    // }
    //
    // const filePath = join(process.cwd(), options.icon)
    // const file = await fs.promises.readFile(filePath, 'base64')
    //
    // const request = Application.createRequest()
    // await request.post(`/guilds/${this.guild.id}/roles`, )
  }
}