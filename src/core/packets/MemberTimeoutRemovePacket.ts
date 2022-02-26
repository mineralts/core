import Packet from '../entities/Packet'
import Assembler from '../../assembler/Assembler'

export default class MemberTimeoutRemovePacket extends Packet {
  public packetType = 'GUILD_MEMBER_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    const client = assembler.application.client
    const guild = client.guilds.cache.get(payload.guild_id)

    const member = guild?.members.cache.get(payload.user.id)

    if (member?.communicationTimeout !== payload.communication_disabled_until) {
      member!.communicationTimeout = null
      assembler.eventListener.emit('remove:MemberTimeout', member)
    }
  }
}