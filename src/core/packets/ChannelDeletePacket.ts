import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import TextChannel from '../../api/entities/channels/TextChannel'
import DMChannel from '../../api/entities/channels/DMChannel'
import CategoryChannel from '../../api/entities/channels/CategoryChannel'
import VoiceChannel from '../../api/entities/channels/VoiceChannel'
import StageChannel from '../../api/entities/channels/StageChannel'
import NewsChannel from '../../api/entities/channels/NewsChannel'

export default class ChannelDeletePacket extends Packet {
  public packetType = 'CHANNEL_DELETE'

  public async handle (assembler: Assembler, payload: any) {
    const guild = assembler.application.client.guilds.cache.get(payload.guild_id)
    const channel = guild?.channels.cache.get(payload.id)

    if (!channel) {
      assembler.application.logger.error('Channel is missing')
      return
    }

    if (channel instanceof TextChannel) assembler.eventListener.emit('delete:TextChannel', channel)
    if (channel instanceof DMChannel) assembler.eventListener.emit('delete:DmChannel', channel)
    if (channel instanceof CategoryChannel) assembler.eventListener.emit('delete:CategoryChannel', channel)
    if (channel instanceof VoiceChannel) assembler.eventListener.emit('delete:VoiceChannel', channel)
    if (channel instanceof StageChannel) assembler.eventListener.emit('delete:StageChannel', channel)
    if (channel instanceof NewsChannel) assembler.eventListener.emit('delete:NewsChannel', channel)

    assembler.eventListener.emit('delete:Channel', channel)

    guild?.channels.cache.delete(channel.id)
  }
}