import Packet from '../entities/Packet'
import { RoleBuilder } from '../../assembler/builders'
import Guild from '../../api/entities/guild/Guild'
import Role from '../../api/entities/roles'
import Ioc from '../../Ioc'

export default class RoleUpdatePacket extends Packet {
  public packetType = 'GUILD_ROLE_UPDATE'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild: Guild | undefined = client?.guilds.cache.get(payload.guild_id)
    const before: Role | undefined = guild?.roles.cache.get(payload.role.id)

    const roleBuilder: RoleBuilder = new RoleBuilder()
    const after: Role = roleBuilder.build(payload.role)

    emitter.emit('update:Role', before, after)

    guild?.roles.cache.set(after.id, after)
  }
}