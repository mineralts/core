import Packet from '../entities/Packet'
import TextChannel from '../../api/entities/channels/TextChannel'
import DMChannel from '../../api/entities/channels/DMChannel'
import CategoryChannel from '../../api/entities/channels/CategoryChannel'
import VoiceChannel from '../../api/entities/channels/VoiceChannel'
import StageChannel from '../../api/entities/channels/StageChannel'
import NewsChannel from '../../api/entities/channels/NewsChannel'
import Application from '../../application/Application'

export default class ChannelDeletePacket extends Packet {
  public packetType = 'CHANNEL_DELETE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')
    const logger = Application.singleton().resolveBinding('Mineral/Core/Logger')

    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const channel = guild.channels.cache.get(payload.id)

    if (!channel) {
      logger?.error('Channel is missing')
      return
    }

    if (channel instanceof TextChannel) emitter.emit('delete:TextChannel', channel)
    if (channel instanceof DMChannel) emitter.emit('delete:DmChannel', channel)
    if (channel instanceof CategoryChannel) emitter.emit('delete:CategoryChannel', channel)
    if (channel instanceof VoiceChannel) emitter.emit('delete:VoiceChannel', channel)
    if (channel instanceof StageChannel) emitter.emit('delete:StageChannel', channel)
    if (channel instanceof NewsChannel) emitter.emit('delete:NewsChannel', channel)

    emitter.emit('delete:Channel', channel)

    guild?.channels.cache.delete(channel.id)
  }
}