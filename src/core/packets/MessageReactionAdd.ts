import Packet from '../entities/Packet'
import { EmojiBuilder, ReactionBuilder } from '../../assembler/builders'
import TextChannel from '../../api/entities/channels/TextChannel'
import GuildMember from '../../api/entities/guild/GuildMember'
import Emoji from '../../api/entities/emoji'
import Reaction from '../../api/entities/reaction/Reaction'
import Ioc from '../../Ioc'

export default class MessageReactionAdd extends Packet {
  public packetType = 'MESSAGE_REACTION_ADD'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const channel = guild.channels.cache.get(payload.channel_id) as TextChannel
    const message = channel.messages.cache.get(payload.message_id)

    if (message) {
      const member: GuildMember | undefined = guild.members.cache.get(payload.user_id)
      if (!member) {
        return
      }

      const emojiBuilder: EmojiBuilder = new EmojiBuilder(guild)
      const emoji: Emoji = emojiBuilder.build(payload.emoji)

      const reactionBuilder: ReactionBuilder = new ReactionBuilder(client, emoji, member)
      const reaction: Reaction = reactionBuilder.build()

      message.reactions.addReaction(emoji, member)

      emitter.emit('add:MessageReaction', message, reaction)
    }
  }
}