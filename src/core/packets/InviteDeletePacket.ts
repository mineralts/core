import Packet from '../entities/Packet'
import Ioc from '../../Ioc'

export default class InviteDeletePacket extends Packet {
  public packetType = 'INVITE_DELETE'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const invite = guild!.invites.cache.get(payload.code)
    if (!invite) {
      return
    }

    emitter.emit('delete:Invite', invite)

    guild.invites.cache.delete(invite.code)
  }
}