import Packet from '../entities/Packet'
import Application from '../../application/Application'

export default class GuildDeletePacket extends Packet {
  public packetType = 'GUILD_DELETE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')
    const guild = client?.guilds.cache.get(payload.guild_id)

    emitter.emit('delete:Guild', guild)
    client?.guilds.cache.delete(payload.guild_id)
  }
}