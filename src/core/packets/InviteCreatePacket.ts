import Packet from '../entities/Packet'
import { DateTime } from 'luxon'
import Invite from '../../api/entities/invitation/Invite'
import Ioc from '../../Ioc'

export default class InviteCreatePacket extends Packet {
  public packetType = 'INVITE_CREATE'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const member = guild?.members.cache.get(payload.inviter.id)
    const channel = guild?.channels.cache.get(payload.channel_id)

    const invite = new Invite(
      member as any,
      channel as any,
      payload.code,
      payload.uses,
      payload.max_uses,
      payload.temporary,
      DateTime.fromISO(payload.expires_at),
      DateTime.fromISO(payload.created_at)
    )

    guild?.invites.cache.set(payload.code, invite)

    emitter.emit('create:Invite', invite)
  }
}