import Packet from '../entities/Packet'
import Application from '../../application/Application'

export default class InviteDeletePacket extends Packet {
  public packetType = 'INVITE_DELETE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')

    const guild = client?.guilds.cache.get(payload.guild_id)
    const invite = guild!.invites.cache.get(payload.code)

    if (!invite) {
      return
    }

    emitter.emit('delete:Invite', invite)

    guild?.invites.cache.delete(invite.code)
  }
}