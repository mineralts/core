import Packet from '../entities/Packet'
import Guild from '../../api/entities/guild/Guild'
import Role from '../../api/entities/roles'
import Application from '../../application/Application'

export default class RoleDeletePacket extends Packet {
  public packetType = 'GUILD_ROLE_DELETE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')

    const guild: Guild | undefined = client?.guilds.cache.get(payload.guild_id)
    const role: Role | undefined = guild?.roles.cache.get(payload.role_id)

    if (!role) {
      return
    }

    emitter.emit('delete:Role', role)

    guild?.roles.cache.delete(role.id)
  }
}