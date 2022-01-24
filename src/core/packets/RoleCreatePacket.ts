import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import { Guild, Role } from '../../api/entities'
import { RoleBuilder } from '../../assembler/builders'

export default class RoleCreatePacket extends Packet {
  public packetType = 'GUILD_ROLE_CREATE'

  public async handle (assembler: Assembler, payload: any) {
    const guild: Guild | undefined = assembler.application.client.guilds.cache.get(payload.guild_id)

    const roleBuilder: RoleBuilder = new RoleBuilder()
    const role: Role = roleBuilder.build(payload.role)

    guild?.roles.cache.set(role.id, role)

    assembler.eventListener.emit('roleCreate', role)
  }
}