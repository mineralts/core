import Packet from '../entities/Packet'
import Assembler from '../../assembler/Assembler'
import { EmojiBuilder, ReactionBuilder } from '../../assembler/builders'
import TextChannel from '../../api/entities/channels/TextChannel'
import GuildMember from '../../api/entities/guild/GuildMember'
import Emoji from '../../api/entities/emoji'
import Reaction from '../../api/entities/reaction/Reaction'

export default class MessageReactionAdd extends Packet {
  public packetType = 'MESSAGE_REACTION_ADD'

  public async handle (assembler: Assembler, payload: any) {
    const client = assembler.application.client

    const guild = client.guilds.cache.get(payload.guild_id)
    const channel = guild?.channels.cache.get(payload.channel_id) as TextChannel
    const message = channel.messages.cache.get(payload.message_id)

    if (message) {
      const member: GuildMember | undefined = guild?.members.cache.get(payload.user_id)

      const emojiBuilder: EmojiBuilder = new EmojiBuilder(guild)
      const emoji: Emoji = emojiBuilder.build(payload.emoji)

      const reactionBuilder: ReactionBuilder = new ReactionBuilder(client as any, emoji, member!)
      const reaction: Reaction = reactionBuilder.build()

      message.reactions.addReaction(emoji, member!)

      assembler.eventListener.emit('add:MessageReaction', message, reaction)
    }
  }
}