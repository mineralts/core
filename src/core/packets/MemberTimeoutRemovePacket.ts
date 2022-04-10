import Packet from '../entities/Packet'
import Ioc from '../../Ioc'

export default class MemberTimeoutRemovePacket extends Packet {
  public packetType = 'GUILD_MEMBER_UPDATE'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild = client?.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const member = guild.members.cache.get(payload.user.id)
    if (!member) {
      return
    }

    if (member.communicationTimeout !== payload.communication_disabled_until) {
      member.communicationTimeout = null
      emitter.emit('remove:MemberTimeout', member)
    }
  }
}