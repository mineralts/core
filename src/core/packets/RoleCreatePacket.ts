import Packet from '../entities/Packet'
import { RoleBuilder } from '../../assembler/builders'
import Guild from '../../api/entities/guild/Guild'
import Role from '../../api/entities/roles'
import Application from '../../application/Application'

export default class RoleCreatePacket extends Packet {
  public packetType = 'GUILD_ROLE_CREATE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')

    const guild: Guild | undefined = client?.guilds.cache.get(payload.guild_id)

    const roleBuilder: RoleBuilder = new RoleBuilder()
    const role: Role = roleBuilder.build(payload.role)

    guild?.roles.cache.set(role.id, role)

    emitter.emit('create:Role', role)
  }
}