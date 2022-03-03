import Packet from '../entities/Packet'
import TextChannel from '../../api/entities/channels/TextChannel'
import Application from '../../application/Application'

export default class MessageUnPinPacket extends Packet {
  public packetType = 'MESSAGE_UPDATE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')

    const guild = client?.guilds.cache.get(payload.guild_id)
    const channel = guild?.channels.cache.get(payload.channel_id) as TextChannel
    const message = channel.messages.cache.get(payload.id)

    if (message?.pinned && !payload.pinned) {
      emitter.emit('unpin:Message', message)
    }
  }
}