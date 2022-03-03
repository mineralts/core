import Packet from '../entities/Packet'
import Collection from '../../api/utils/Collection'
import { Region, Snowflake } from '../../api/types'
import { EmojiBuilder, RoleBuilder } from '../../assembler/builders'
import Role from '../../api/entities/roles'
import Emoji from '../../api/entities/emoji'
import Guild from '../../typing/interfaces/guild/Guild'
import GuildStickerManager from '../../api/entities/guild/GuildStickerManager'
import GuildEmojiManager from '../../api/entities/guild/GuildEmojiManager'
import GuildRoleManager from '../../api/entities/guild/GuildRoleManager'
import { OnlyKeys } from '../../typing/interfaces'
import Application from '../../application/Application'

export default class GuildUpdatePacket extends Packet {
  public packetType = 'GUILD_UPDATE'

  private roles: Collection<Snowflake, Role> = new Collection()
  private emojis: Collection<Snowflake, Emoji> = new Collection()

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')

    const before = { ...client?.guilds.cache.get(payload.guild_id) } as Omit<Guild, OnlyKeys<Guild>>
    const guild = client?.guilds.cache.clone().get(payload.guild_id)

    guild.emojis = new GuildEmojiManager()
    guild.roles = new GuildRoleManager(guild)
    guild.premiumTier = payload.premium_tiers
    guild.systemChannelFlags = payload.system_channel_flags
    guild.discoverySplash = payload.discovery_splash
    guild.applicationId = payload.application_id
    guild.ownerId = payload.owner_id
    guild.owner = before?.members.cache.get(payload.owner_id)
    guild.banner = payload.banner
    guild.features = payload.features
    guild.hasPremiumProgressBarEnabled = payload.premium_progress_bar_enabled
    guild.publicUpdateChannelId = payload.public_updates_channel_id
    guild.verificationLevel = payload.verification_level
    guild.splash = payload.splash
    guild.afkTimeout = payload.afk_timeout
    guild.vanityUrlCode = payload.vanity_url_code
    guild.icon = payload.icon
    guild.maxVideoChannelUsers = payload.max_video_channel_users
    guild.region = Region[payload.preferred_locale]
    guild.explicitContentFilter = payload.explicit_content_filter
    guild.stickers = new GuildStickerManager()
    guild.ruleChannelId = payload.rules_channel_id
    guild.name = payload.name
    guild.nsfw = payload.nsfw
    guild.maxMemberSize = payload.max_members
    guild.description = payload.description
    guild.premiumSubscriptionCount = payload.premium_subscription_count
    guild.mfaLevel = payload.mfa_level
    guild.afkChannelId = payload.afk_channel_id

    const roleBuilder = new RoleBuilder()
    payload.roles.forEach((item: any) => {
      const role = roleBuilder.build(item)
      guild?.roles.cache.set(role.id, role)
    })

    const emojiBuilder = new EmojiBuilder()
    payload.emojis.forEach((item: any) => {
      const emoji = emojiBuilder.build(item)
      guild?.emojis.cache.set(emoji.id, emoji)
    })


    emitter.emit('update:Guild', before, guild)
    client?.guilds.cache.set(guild.id, guild)
  }
}