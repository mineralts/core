import Packet from '../entities/Packet'
import Ioc from '../../Ioc'

export default class ThreadDeletePacket extends Packet {
  public packetType = 'THREAD_DELETE'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')
    const console = Ioc.singleton().resolve('Mineral/Core/Console')

    const guild = client?.guilds.cache.get(payload.guild_id)
    const channel = guild?.channels.cache.get(payload.id)

    if (!channel) {
      console.logger.error('Channel is missing')
      return
    }

    emitter.emit('delete:ThreadChannel', channel)
    emitter.emit('delete:Channel', channel)

    guild?.channels.cache.delete(channel.id)
  }
}