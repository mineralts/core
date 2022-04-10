import Packet from '../entities/Packet'
import TextChannel from '../../api/entities/channels/TextChannel'
import Ioc from '../../Ioc'

export default class MessageUnPinPacket extends Packet {
  public packetType = 'MESSAGE_UPDATE'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const channel = guild.channels.cache.get(payload.channel_id) as TextChannel
    if (!channel) {
      return
    }

    const message = channel.messages.cache.get(payload.id)

    if (message?.pinned && !payload.pinned) {
      emitter.emit('unpin:Message', message)
    }
  }
}