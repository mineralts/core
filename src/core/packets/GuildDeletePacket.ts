import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'

export default class GuildDeletePacket extends Packet {
  public packetType = 'GUILD_DELETE'

  public async handle (assembler: Assembler, payload: any) {
    const client = assembler.application.client
    const guild = client.guilds.cache.get(payload.guild_id)

    assembler.eventListener.emit('delete:Guild', guild)
    client.guilds.cache.delete(payload.guild_id)
  }
}