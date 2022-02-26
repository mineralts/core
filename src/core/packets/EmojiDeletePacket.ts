import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import { Snowflake } from '../../api/types'
import Collection from '../../api/utils/Collection'
import Guild from '../../api/entities/guild/Guild'
import Emoji from '../../api/entities/emoji'

export default class EmojiDeletePacket extends Packet {
  public packetType = 'GUILD_EMOJIS_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    const guild: Guild | undefined = assembler.application.client.guilds.cache.get(payload.guild_id)
    const guildEmojis: Collection<Snowflake, Emoji> = guild?.emojis.cache.clone()

    if (payload.emojis.length < guildEmojis!.size) {
      payload.emojis?.forEach((emoji: Emoji) => {
        const item = guildEmojis.get(emoji.id)
        if (item) {
          guildEmojis.delete(item.id)
        }
      })

      assembler.eventListener.emit('delete:Emoji', guildEmojis.first())
      guild?.emojis.cache.delete(guildEmojis.first()!.id)
    }
  }
}