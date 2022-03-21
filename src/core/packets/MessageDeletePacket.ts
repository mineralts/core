import Packet from '../entities/Packet'
import TextChannel from '../../api/entities/channels/TextChannel'
import Application from '../../application/Application'

export default class MessageDeletePacket extends Packet {
  public packetType = 'MESSAGE_DELETE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')

    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const channel = guild.channels.cache.get(payload.channel_id) as TextChannel
    if (!channel) {
      return
    }

    const message = channel.messages.cache.get(payload.id)

    if (!message) {
      return
    }

    emitter.emit('delete:Message', message)

    channel.messages.cache.delete(payload.id)
  }
}