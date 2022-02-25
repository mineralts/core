import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'

export default class ChannelDeletePacket extends Packet {
  public packetType = 'CHANNEL_DELETE'

  public async handle (assembler: Assembler, payload: any) {
    const guild = assembler.application.client.guilds.cache.get(payload.guild_id)
    const channel = guild?.channels.cache.get(payload.id)

    assembler.eventListener.emit('channelDelete', channel)

    if (!channel) {
      assembler.application.logger.error('Channel is missing')
      return
    }

    guild?.channels.cache.delete(channel.id)
  }
}