import Packet from '../entities/Packet'
import TextChannel from '../../api/entities/channels/TextChannel'
import Reaction from '../../api/entities/reaction/Reaction'
import Application from '../../application/Application'

export default class MessageReactionRemove extends Packet {
  public packetType = 'MESSAGE_REACTION_REMOVE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')

    const guild = client?.guilds.cache.get(payload.guild_id)
    const channel = guild?.channels.cache.get(payload.channel_id) as TextChannel
    const message = channel.messages.cache.get(payload.message_id)

    if (message) {
      const reactions = message.reactions.cache.get(payload.user_id)
      const target = reactions!.find((reaction: Reaction) => (
        reaction.emoji.label === payload.emoji.name
      ))

      if (!target) {
        return
      }

      const index = reactions!.indexOf(target!)
      const reaction = reactions!.splice(index, 1)!

      if (!reactions?.length) {
        message.reactions.cache.delete(payload.user_id)
      }

      emitter.emit('remove:MessageReaction', message, reaction[0])
    }
  }
}