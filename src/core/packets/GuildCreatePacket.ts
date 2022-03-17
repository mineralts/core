import Packet from '../entities/Packet'
import Collection from '../../api/utils/Collection'
import { ChannelResolvable, Snowflake } from '../../api/types'
import {
  ChannelBuilder,
  EmojiBuilder,
  GuildBuilder,
  GuildMemberBuilder,
  InviteBuilder,
  PresenceBuilder,
  RoleBuilder
} from '../../assembler/builders'
import GuildMember from '../../api/entities/guild/GuildMember'
import Presence from '../../api/entities/presence'
import Role from '../../api/entities/roles'
import Emoji from '../../api/entities/emoji'
import GuildChannelManager from '../../api/entities/guild/GuildChannelManager'
import CategoryChannel from '../../api/entities/channels/CategoryChannel'
import Application from '../../application/Application'

export default class GuildCreatePacket extends Packet {
  public packetType = 'GUILD_CREATE'

  public async handle (payload: any) {
    const guildMembers: Collection<Snowflake, GuildMember> = new Collection()
    const guildBots: Collection<Snowflake, GuildMember> = new Collection()

    const presences: Collection<Snowflake, Presence> = new Collection()
    const roles: Collection<Snowflake, Role> = new Collection()
    const emojis: Collection<Snowflake, Emoji> = new Collection()
    const channels: Collection<Snowflake, ChannelResolvable> = new Collection()

    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')
    const connector = Application.singleton().resolveBinding('Mineral/Core/Connector')!

    const roleBuilder = new RoleBuilder()
    payload.roles.forEach((item: any) => {
      const role = roleBuilder.build(item)
      roles.set(role.id, role)
    })

    const guildBuilder = new GuildBuilder(client!, payload)
    const guild = guildBuilder.build(guildMembers)

    guild.emojis.register(emojis)
    guild.roles.register(roles)

    const guildMemberBuilder = new GuildMemberBuilder(client!, roles, guild)
    payload.members.forEach((item: any) => {
      const guildMember = guildMemberBuilder.build(item)

      if (guildMember.user.isBot()) {
        guildBots.set(guildMember.user.id, guildMember)
      } else {
        guildMembers.set(guildMember.user.id, guildMember)
      }
    })

    const emojiBuilder = new EmojiBuilder()
    payload.emojis.forEach((item: any) => {
      const emoji = emojiBuilder.build(item)
      emojis.set(emoji.id, emoji)
    })

    const presenceBuilder = new PresenceBuilder(client!, guild, guildMembers.concat(guildBots))
    payload.presences.forEach((item: any) => {
      const presence = presenceBuilder.build(item)
      presences.set(presence.member.user.id, presence)
    })

    const channelBuilder = new ChannelBuilder(client!, guild)
    payload.channels.forEach((item: any) => {
      const channel = channelBuilder.build(item)

      if (!(channel instanceof CategoryChannel)) {
        channel.parent = channels.get(channel.parentId!)
      }

      channels.set(
        channel ? channel.id : item.id,
        channel
      )
    })

    guildMembers.forEach((member: GuildMember) => {
      member.guild = guild
      member.user.presence = presences.get(member.user.id)
    })

    guildBots.forEach((member: GuildMember) => {
      member.guild = guild
      member.user.presence = presences.get(member.user.id)
    })

    guild.owner = guildMembers.get(payload.owner_id)
    guild.members.register(guildMembers)
    guild.bots.register(guildBots)
    guild.channels = new GuildChannelManager(guild).register(channels)

    payload.threads.forEach((item: any) => {
      const channel = channelBuilder.build(item)

      channels.set(
        channel ? channel.id : item.id,
        channel
      )
    })

    const { data: invites } = await connector.http.get(`/guilds/${guild.id}/invites`)

    const inviteBuilder = new InviteBuilder(client!, guild)
    invites.forEach((item) => {
      const invite = inviteBuilder.build(item)
      guild.invites.cache.set(invite.code, invite)
    })

    await guild.registerCommands()

    client?.guilds.cache.set(guild.id, guild as any)

    emitter.emit('create:Guild', guild)
  }
}