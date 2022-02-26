import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import TextChannel from '../../api/entities/channels/TextChannel'

export default class MessageDeletePacket extends Packet {
  public packetType = 'MESSAGE_DELETE'

  public async handle (assembler: Assembler, payload: any) {
    const guild = assembler.application.client.guilds.cache.get(payload.guild_id)
    const channel = guild?.channels.cache.get(payload.channel_id) as TextChannel
    const message = channel.messages.cache.get(payload.id)

    if (!message) {
      return
    }

    assembler.eventListener.emit('delete:Message', message)

    channel.messages.cache.delete(payload.id)
  }
}