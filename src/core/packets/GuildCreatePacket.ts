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
import Guild from '../../api/entities/guild/Guild'
import GuildChannelManager from '../../api/entities/guild/GuildChannelManager'
import CategoryChannel from '../../api/entities/channels/CategoryChannel'
import Application from '../../application/Application'

export default class GuildCreatePacket extends Packet {
  public packetType = 'GUILD_CREATE'

  private guildMembers: Collection<Snowflake, GuildMember> = new Collection()
  private guildBots: Collection<Snowflake, GuildMember> = new Collection()

  private presences: Collection<Snowflake, Presence> = new Collection()
  private roles: Collection<Snowflake, Role> = new Collection()
  private emojis: Collection<Snowflake, Emoji> = new Collection()
  private channels: Collection<Snowflake, ChannelResolvable> = new Collection()
  private guild!: Guild

  public async handle (payload: any) {
    console.log(payload.threads)
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')
    const connector = Application.singleton().resolveBinding('Mineral/Core/Connector')!

    const roleBuilder = new RoleBuilder()
    payload.roles.forEach((item: any) => {
      const role = roleBuilder.build(item)
      this.roles.set(role.id, role)
    })

    const guild = new GuildBuilder(client!, payload)
    this.guild = guild.build(this.guildMembers)

    this.guild.emojis.register(this.emojis)
    this.guild.roles.register(this.roles)

    const guildMemberBuilder = new GuildMemberBuilder(client!, this.roles, this.guild)
    payload.members.forEach((item: any) => {
      const guildMember = guildMemberBuilder.build(item)

      if (guildMember.user.isBot()) {
        this.guildBots.set(guildMember.user.id, guildMember)
      } else {
        this.guildMembers.set(guildMember.user.id, guildMember)
      }
    })

    const emojiBuilder = new EmojiBuilder()
    payload.emojis.forEach((item: any) => {
      const emoji = emojiBuilder.build(item)
      this.emojis.set(emoji.id, emoji)
    })

    const presenceBuilder = new PresenceBuilder(client!, this.guild, this.guildMembers.concat(this.guildBots))
    payload.presences.forEach((item: any) => {
      const presence = presenceBuilder.build(item)
      this.presences.set(presence.member.user.id, presence)
    })

    const channelBuilder = new ChannelBuilder(client!, this.guild)
    payload.channels.forEach((item: any) => {
      const channel = channelBuilder.build(item)

      if (!(channel instanceof CategoryChannel)) {
        channel.parent = this.channels.get(channel.parentId!)
      }

      this.channels.set(
        channel ? channel.id : item.id,
        channel
      )
    })

    this.guildMembers.forEach((member: GuildMember) => {
      member.guild = this.guild
      member.user.presence = this.presences.get(member.user.id)
    })

    this.guildBots.forEach((member: GuildMember) => {
      member.guild = this.guild
      member.user.presence = this.presences.get(member.user.id)
    })

    this.guild.owner = this.guildMembers.get(payload.owner_id)
    this.guild.members.register(this.guildMembers)
    this.guild.bots.register(this.guildBots)
    this.guild.channels = new GuildChannelManager(this.guild).register(this.channels)

    payload.threads.forEach((item: any) => {
      const channel = channelBuilder.build(item)

      this.channels.set(
        channel ? channel.id : item.id,
        channel
      )
    })

    const { data: invites } = await connector.http.get(`/guilds/${this.guild.id}/invites`)

    const inviteBuilder = new InviteBuilder(client!, this.guild)
    invites.forEach((item) => {
      const invite = inviteBuilder.build(item)
      this.guild.invites.cache.set(invite.code, invite)
    })

    await this.guild.registerCommands()

    client?.guilds.cache.set(this.guild.id, this.guild as any)

    emitter.emit('create:Guild', this.guild)
  }
}