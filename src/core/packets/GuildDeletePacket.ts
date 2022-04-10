import Packet from '../entities/Packet'
import Ioc from '../../Ioc'

export default class GuildDeletePacket extends Packet {
  public packetType = 'GUILD_DELETE'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')
    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    emitter.emit('delete:Guild', guild)
    client.guilds.cache.delete(payload.guild_id)
  }
}