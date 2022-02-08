import Collection from '../../utils/Collection'
import { Snowflake } from '../../types'
import Emoji from '../emoji'
import { join } from 'path'
import fs from 'fs'
import Role from '../roles'
import Application from '../../../application/Application'
import Guild from './Guild'
import { EmojiBuilder } from '../../../assembler/builders'

export default class GuildEmojiManager {
  public cache: Collection<Snowflake, Emoji> = new Collection()
  private guild: Guild

  public defineContext<T> (context: { [K: string]: T }) {
    Object.entries(context).forEach(([Key, value]) => {
      this[Key] = value
    })
  }

  public register (emojis: Collection<Snowflake, Emoji>) {
    this.cache = emojis
    return this
  }

  public async create (name: string, path: string, roles?: Role[] | Snowflake[]) {
    const filePath = join(process.cwd(), path)
    const file = await fs.promises.readFile(filePath, 'base64')

    const request = Application.createRequest()
    const data = await request.post(`/guilds/${this.guild.id}/emojis`, {
      name,
      image: `data:image/png;base64,${file}`,
      roles: roles
        ? roles.map((role: Role | Snowflake) => role instanceof Role ? role.id : role)
        : []
    })

    return new EmojiBuilder(this.guild).build(data)
  }
}