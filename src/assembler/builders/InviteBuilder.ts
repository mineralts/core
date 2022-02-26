import { DateTime } from 'luxon'
import Invite from '../../api/entities/invitation/Invite'
import Client from '../../api/entities/client'
import Guild from '../../api/entities/guild/Guild'

export default class InviteBuilder {
  constructor (private client: Client, private guild: Guild) {
  }

  public build (payload: any) {
    return new Invite(
      this.guild.members.cache.get(payload.inviter.id)!,
      this.guild.channels.cache.get(payload.channel.id)!,
      payload.code,
      payload.uses,
      payload.max_uses,
      payload.temporary,
      DateTime.now().plus(payload.max_age * 1000),
      DateTime.fromISO(payload.created_at)
    )
  }
}