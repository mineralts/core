import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'

export default class InviteDeletePacket extends Packet {
  public packetType = 'INVITE_DELETE'

  public async handle (assembler: Assembler, payload: any) {
    const guild = assembler.application.client.guilds.cache.get(payload.guild_id)
    const invite = guild!.invites.cache.get(payload.code)

    if (!invite) {
      return
    }

    assembler.eventListener.emit('inviteDelete', invite)

    guild?.invites.cache.delete(invite.code)
  }
}