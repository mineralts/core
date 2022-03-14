import Packet from '../entities/Packet'
import Application from '../../application/Application'

export default class MemberTimeoutRemovePacket extends Packet {
  public packetType = 'GUILD_MEMBER_UPDATE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')

    const guild = client?.guilds.cache.get(payload.guild_id)
    const member = guild?.members.cache.get(payload.user.id)

    if (!member) {
      return
    }

    if (member?.communicationTimeout !== payload.communication_disabled_until) {
      member!.communicationTimeout = null
      emitter.emit('remove:MemberTimeout', member)
    }
  }
}