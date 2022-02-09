import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import { Emoji, Guild, Role, Snowflake } from '../../api/entities'
import { EmojiBuilder } from '../../assembler/builders'
import Collection from '../../api/utils/Collection'

export default class EmojiUpdatePacket extends Packet {
  public packetType = 'GUILD_EMOJIS_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    const guild: Guild | undefined = assembler.application.client.guilds.cache.get(payload.guild_id)

    if (payload.emojis.length === guild?.emojis.cache.size) {
      console.log('Update', payload.emojis.length === guild?.emojis.cache.size, payload.emojis.length, guild?.emojis.cache.size)
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
        assembler.application.logger.error('An error has occurred (emoji not recognised)')
        return
      }

      assembler.eventListener.emit('emojiUpdate', emoji, guild?.emojis.cache.get(emoji[0].id))
    }
  }
}