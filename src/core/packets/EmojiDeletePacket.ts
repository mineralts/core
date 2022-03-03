import Packet from '../entities/Packet'
import { Snowflake } from '../../api/types'
import Collection from '../../api/utils/Collection'
import Guild from '../../api/entities/guild/Guild'
import Emoji from '../../api/entities/emoji'
import Application from '../../application/Application'

export default class EmojiDeletePacket extends Packet {
  public packetType = 'GUILD_EMOJIS_UPDATE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')

    const guild: Guild | undefined = client?.guilds.cache.get(payload.guild_id)
    const guildEmojis: Collection<Snowflake, Emoji> = guild?.emojis.cache.clone()

    if (payload.emojis.length < guildEmojis!.size) {
      payload.emojis?.forEach((emoji: Emoji) => {
        const item = guildEmojis.get(emoji.id)
        if (item) {
          guildEmojis.delete(item.id)
        }
      })

      emitter.emit('delete:Emoji', guildEmojis.first())
      guild?.emojis.cache.delete(guildEmojis.first()!.id)
    }
  }
}