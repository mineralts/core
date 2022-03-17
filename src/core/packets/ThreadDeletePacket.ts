import Packet from '../entities/Packet'
import Application from '../../application/Application'

export default class ThreadDeletePacket extends Packet {
  public packetType = 'THREAD_DELETE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')
    const logger = Application.singleton().resolveBinding('Mineral/Core/Logger')

    const guild = client?.guilds.cache.get(payload.guild_id)
    const channel = guild?.channels.cache.get(payload.id)

    if (!channel) {
      logger?.error('Channel is missing')
      return
    }

    emitter.emit('delete:ThreadChannel', channel)
    emitter.emit('delete:Channel', channel)

    guild?.channels.cache.delete(channel.id)
  }
}