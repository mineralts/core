import Packet from '../entities/Packet'
import { Snowflake } from '../../api/types'
import { EmojiBuilder } from '../../assembler/builders'
import Collection from '../../api/utils/Collection'
import Emoji from '../../api/entities/emoji'
import Guild from '../../api/entities/guild/Guild'
import Ioc from '../../Ioc'

export default class EmojiCreatePacket extends Packet {
  public packetType = 'GUILD_EMOJIS_UPDATE'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild: Guild | undefined = client?.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const guildEmojis: Collection<Snowflake, Emoji> = guild.emojis.cache.clone()
    const payloadEmojis: any[] = payload.emojis

    if (payload.emojis.length > guildEmojis!.size) {
      guildEmojis?.forEach((emoji: Emoji) => {
        const item = payloadEmojis.find((item) => item.id === emoji.id)
        const index = payloadEmojis.indexOf(item)
        payloadEmojis.splice(index, 1)
      })

      const emojiBuilder = new EmojiBuilder(guild)
      const emoji = emojiBuilder.build(payloadEmojis[0])

      guild.emojis.cache.set(emoji.id, emoji)

      emitter.emit('create:Emoji', emoji)
    }
  }
}