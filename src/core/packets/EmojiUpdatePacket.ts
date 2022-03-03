import Packet from '../entities/Packet'
import { Snowflake } from '../../api/types'
import { EmojiBuilder } from '../../assembler/builders'
import Collection from '../../api/utils/Collection'
import Emoji from '../../api/entities/emoji'
import Guild from '../../api/entities/guild/Guild'
import Role from '../../api/entities/roles'
import Application from '../../application/Application'

export default class EmojiUpdatePacket extends Packet {
  public packetType = 'GUILD_EMOJIS_UPDATE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')
    const logger = Application.singleton().resolveBinding('Mineral/Core/Logger')

    const guild: Guild | undefined = client?.guilds.cache.get(payload.guild_id)

    if (payload.emojis.length === guild?.emojis.cache.size) {
      const emojis: Collection<Snowflake, Emoji> = new Collection()

      const emojiBuilder = new EmojiBuilder(guild)
      payload.emojis?.forEach((item) => {
        const emoji = emojiBuilder.build(item)
        emojis.set(emoji.id, emoji)
      })

      const emoji = emojis.map((emoji: Emoji) => {
        const currentEmoji = guild?.emojis.cache.get(emoji.id)
        const label = emoji.label !== currentEmoji?.label
        const currentRoles: Snowflake[] | undefined = currentEmoji?.roles.map((role: Role) => role.id)

        const roles = emoji.roles.map((role: Role) => {
          if (!currentRoles?.includes(role.id)) {
            return role
          }
        })

        if (label || roles.length) {
          return currentEmoji
        }
      }).filter((role: Emoji | undefined) => role)

      if (!emoji[0]) {
        logger.error('An error has occurred (emoji not recognised)')
        return
      }

      emitter.emit('update:Emoji', emoji, guild?.emojis.cache.get(emoji[0].id))
    }
  }
}