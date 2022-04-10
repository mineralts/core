import Packet from '../entities/Packet'
import Guild from '../../api/entities/guild/Guild'
import Role from '../../api/entities/roles'
import Ioc from '../../Ioc'

export default class RoleDeletePacket extends Packet {
  public packetType = 'GUILD_ROLE_DELETE'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild: Guild | undefined = client?.guilds.cache.get(payload.guild_id)
    const role: Role | undefined = guild?.roles.cache.get(payload.role_id)

    if (!role) {
      return
    }

    emitter.emit('delete:Role', role)

    guild?.roles.cache.delete(role.id)
  }
}