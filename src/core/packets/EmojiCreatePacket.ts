import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import { Emoji, Guild } from '../../api/entities'
import { EmojiBuilder } from '../../assembler/builders'

export default class EmojiCreatePacket extends Packet {
  public packetType = 'GUILD_EMOJIS_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    const guild: Guild | undefined = assembler.application.client.guilds.cache.get(payload.guild_id)
    const guildEmojis = guild?.emojis.cache
    const payloadEmojis: any[] = payload.emojis

    console.log(payload.emojis.length > guildEmojis!.size, payload.emojis.length, guildEmojis!.size)

    if (payload.emojis.length > guildEmojis!.size) {
      guildEmojis?.forEach((emoji: Emoji) => {
        const item = payloadEmojis.find((item) => item.id === emoji.id)
        const index = payloadEmojis.indexOf(item)
        payloadEmojis.splice(index, 1)
      })

      const emojiBuilder = new EmojiBuilder(guild)
      const emoji = emojiBuilder.build(payloadEmojis[0])

      console.log('emoji', emoji)

      guild?.emojis.cache.set(emoji.id, emoji)

      assembler.eventListener.emit('emojiCreate', emoji)
    }
  }
}