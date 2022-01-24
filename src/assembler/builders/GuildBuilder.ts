import {
  Client,
  Guild,
  GuildChannelManager,
  GuildMember,
  GuildMemberManager,
  GuildRoleManager,
  Region,
  Snowflake,
  GuildEmojiManager,
  InviteManager,
  Collection
} from '../../api/entities'
import { keyFromEnum } from '../../api/utils'

export default class GuildBuilder {
  constructor (private client: Client, private readonly payload: any) {
  }

  public build (guildMembers: Collection<Snowflake, GuildMember>) {
    const region = keyFromEnum(Region, this.payload.region) as keyof typeof Region
    const commandLength = Object.values(this.payload.application_command_counts).reduce((a: any, b: any) => a + b, 0) as number

    const guild = new Guild(
      this.payload.id,
      this.payload.name,
      this.payload.icon,
      this.payload.banner,
      this.payload.splash,
      this.payload.discovery_splash,
      this.payload.description,
      this.payload.premium_tier,
      this.payload.premium_subscription_count,
      this.payload.system_channel_flags,
      this.payload.explicit_content_filter,
      region,
      this.payload.lazy,
      this.payload.application_id,
      this.payload.nsfw,
      this.payload.member_count,
      undefined as any,
      this.payload.stage_instances,
      this.payload.guild_hashes,
      this.payload.afk_channel_id,
      this.payload.public_updates_channel_id,
      new GuildChannelManager(),
      this.payload.verification_level,
      this.payload.premium_progress_bar_enabled,
      this.payload.features,
      this.payload.stickers,
      new GuildMemberManager(),
      new GuildMemberManager(),
      this.payload.rules_channel_id,
      this.payload.guild_scheduled_events,
      this.payload.default_message_notifications,
      this.payload.mfa_level,
      this.payload.threads,
      this.payload.max_members_size,
      new GuildEmojiManager(),
      this.payload.preferred_locale,
      this.payload.owner_id,
      guildMembers.get(this.payload.owner_id),
      this.payload.max_video_channel_users,
      commandLength,
      this.payload.application_command_count,
      this.payload.afk_timeout,
      this.payload.system_channel_id,
      this.payload.vanity_url_code,
      this.payload.embedded_activities,
      new InviteManager()
    )

    guild.setRoles(new GuildRoleManager(guild))

    return guild
  }
}