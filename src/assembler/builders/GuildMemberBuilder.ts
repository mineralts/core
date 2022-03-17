import { UserBuilder } from './UserBuilder'
import { DateTime } from 'luxon'
import Collection from '../../api/utils/Collection'
import { Snowflake } from '../../api/types'
import Role from '../../api/entities/roles'
import Client from '../../api/entities/client'
import Guild from '../../api/entities/guild/Guild'
import GuildMemberRoleManager from '../../api/entities/guild/GuildMemberRoleManager'
import GuildMember from '../../api/entities/guild/GuildMember'
import VoiceState from '../../api/entities/voice/VoiceState'

export default class GuildMemberBuilder {
  constructor (
    private client: Client,
    private readonly roles: Collection<Snowflake, Role>,
    private guild: Guild
  ) {
  }

  public build (payload: any) {
    const user = new UserBuilder(this.client, payload.user).build()

    const guildMember = new GuildMember(
      payload.user.id,
      payload.nick || user.username,
      user,
      this.guild,
      new GuildMemberRoleManager(),
      payload.highest_role
        ? this.roles.get(payload.highest_role)!
        : null,
      payload.pending || false,
      undefined as any,
      payload.communication_disabled_until
        ? DateTime.fromISO(payload.communication_disabled_until)
        : null,
      DateTime.fromISO(payload.joined_at)
    )

    payload.roles.forEach((id: Snowflake) => {
      const role = this.guild.roles.cache.get(id)
      if (role) {
        guildMember.roles.cache.set(role!.id, role!)
      }
    })

    guildMember.voice = new VoiceState(
      guildMember,
      undefined as any,
      undefined as any,
      undefined as any,
      payload.mute,
      payload.deaf,
      undefined as any,
      undefined as any,
      this.guild
    )

    return guildMember
  }
}