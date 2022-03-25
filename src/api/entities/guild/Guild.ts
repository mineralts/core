import Collection from '../../utils/Collection'
import {
  CommandType,
  ExplicitContentLevel,
  Feature,
  GuildFeature,
  LocalPath,
  Milliseconds,
  NotificationLevel,
  PruneOption,
  Region,
  Snowflake,
  SystemChannelFlag,
  VerificationLevel
} from '../../types'
import GuildMember from './GuildMember'
import VoiceChannel from '../channels/VoiceChannel'
import { join } from 'path'
import fs from 'fs'
import TextChannel from '../channels/TextChannel'
import Application from '../../../application/Application'
import Command from '../../command/Command'
import GuildRoleManager from './GuildRoleManager'
import GuildChannelManager from './GuildChannelManager'
import GuildStickerManager from './GuildStickerManager'
import GuildMemberManager from './GuildMemberManager'
import GuildThreadManager from './GuildThreadManager'
import GuildEmojiManager from './GuildEmojiManager'
import InviteManager from '../invitation/InviteManager'
import GuildHashes from './GuildHashes'
import Assembler from '../../../assembler/Assembler'
import { serializeCommand } from '../../utils'
import { DateTime } from 'luxon'

export default class Guild {
  public commands: Collection<Snowflake, Command> = new Collection()

  constructor (
    public id: Snowflake,
    public name: string,
    public icon: string | null,
    public banner: string | null,
    public splash: string | null,
    public discoverySplash: string | null,
    public description: string | undefined,
    public premiumTier: number,
    public premiumSubscriptionCount: number,
    public systemChannelFlags: number,
    public explicitContentFilter: number,
    public region: keyof typeof Region,
    public isLazy: boolean,
    public applicationId: string | null,
    public nsfw: boolean,
    public memberCount: number,
    public roles: GuildRoleManager,
    public stageInstances: [],
    public guildHashes: GuildHashes,
    public afkChannelId: Snowflake,
    public publicUpdateChannelId: Snowflake,
    public channels: GuildChannelManager,
    public verificationLevel: number,
    public hasPremiumProgressBarEnabled: boolean,
    public features: GuildFeature[],
    public stickers: GuildStickerManager,
    public members: GuildMemberManager,
    public bots: GuildMemberManager,
    public ruleChannelId: Snowflake,
    public guildScheduledEvents: any[],
    public defaultMessageNotifications: keyof typeof NotificationLevel,
    public mfaLevel: number,
    public threads: GuildThreadManager,
    public maxMemberSize: number,
    public emojis: GuildEmojiManager,
    public defaultLang: string,
    public ownerId: Snowflake,
    public owner: GuildMember | undefined,
    public maxVideoChannelUsers: number,
    public registeredCommandCount: number,
    public applicationCommandCount: number,
    public afkTimeout: number,
    public systemChannelId: Snowflake,
    public vanityUrlCode: string | null,
    public embeddedActivities: any[],
    public invites: InviteManager,
    public createdAt: DateTime | undefined
  ) {
  }

  public async setName (value: string): Promise<void> {
    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status } = await request.patch(`/guilds/${this.id}`, { name: value })

    if (status === 200) {
      this.name = value
    }
  }

  public async setPreferredLocale (region: keyof typeof Region): Promise<void> {
    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status } = await request.patch(`/guilds/${this.id}`, {
      preferred_locale: region
    })

    if (status === 200) {
      this.region = region
    }
  }

  public async leave (): Promise<void> {
    const client = Application.getClient()
    if (this.ownerId === client.user.id) {
      throw new Error('GUILD_OWNER')
    }

    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status } = await request.delete(`/guilds/${this.id}`)

    if (status === 200) {
      client.guilds.cache.delete(this.id)
    }
  }

  public isNsfw (): boolean {
    return this.nsfw
  }

  public setRoles (roleManager: GuildRoleManager) {
    this.roles = roleManager
  }

  public async setAfkChannel (voiceChannel: VoiceChannel | Snowflake): Promise<void> {
    const value = voiceChannel instanceof VoiceChannel ? voiceChannel.id : voiceChannel

    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status } = await request.patch(`/guilds/${this.id}`, {
      afk_channel_id: value
    })

    if (status === 200) {
      this.afkChannelId = value
    }
  }

  public async setVerificationLevel (level: keyof typeof VerificationLevel): Promise<void> {
    const value = VerificationLevel[level]

    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status } = await request.patch(`/guilds/${this.id}`, {
      verification_level: value
    })

    if (status === 200) {
      this.verificationLevel = value
    }
  }

  public async setNotificationLevel (level: keyof typeof NotificationLevel): Promise<void> {
    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status } = await request.patch(`/guilds/${this.id}`, {
      default_message_notifications: NotificationLevel[level]
    })

    if (status === 200) {
      this.defaultMessageNotifications = level
    }
  }

  public async setExplicitContentFilter (level: keyof typeof ExplicitContentLevel): Promise<void> {
    const explicitContentFilter = ExplicitContentLevel[level]

    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status } = await request.patch(`/guilds/${this.id}`, {
      explicit_content_filter: explicitContentFilter
    })

    if (status === 200) {
      this.explicitContentFilter = explicitContentFilter
    }
  }

  public async setAfkTimeout (value: Milliseconds): Promise<void> {
    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status } = await request.patch(`/guilds/${this.id}`, {
      afk_timeout: value
    })

    if (status === 200) {
      this.afkTimeout = value
    }
  }

  public hasFeature (feature: keyof typeof Feature): boolean {
    return this.features.includes(feature)
  }

  public async setIcon (path: LocalPath): Promise<void> {
    if (!this.hasFeature('ANIMATED_ICON') && path.split('.')[1] === 'gif') {
      const console = Application.singleton().resolveBinding('Mineral/Core/Console')
      console.logger.warning('Action cancelled. You do not have permission to upload a invitation banner')
      return
    }

    const filePath = join(process.cwd(), path)
    const file = await fs.promises.readFile(filePath, 'base64')

    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status, data } = await request.patch(`/guilds/${this.id}`, {
      icon: `data:image/png;base64,${file}`
    })

    if (status) {
      this.icon = data.icon
    }
  }

  public async removeIcon (): Promise<void> {
    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status, data } = await request.patch(`/guilds/${this.id}`, {
      icon: null
    })

    if (status) {
      this.icon = data.icon
    }
  }

  public async setOwner (member: GuildMember | Snowflake): Promise<void> {
    const client = Application.getClient()
    const value = member instanceof GuildMember ? member.id : member

    if (this.ownerId === client.user.id) {
      throw new Error('OWNER_IS_ALREADY_MEMBER')
    }

    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status } = await request.patch(`/guilds/${this.id}`, {
      owner_id: value
    })

    if (status === 200) {
      this.ownerId = value
      this.owner = this.members.cache.get(value)!
    }
  }

  public async setSplash (path: string): Promise<void> {
    if (!this.features.includes('INVITE_SPLASH')) {
      const console = Application.singleton().resolveBinding('Mineral/Core/Console')
      console.logger.warning('You do not have permission to upload a invitation banner')
    }

    const filePath = join(process.cwd(), path)
    const file = await fs.promises.readFile(filePath, 'base64')

    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status, data } = await request.patch(`/guilds/${this.id}`, {
      splash: `data:image/png;base64,${file}`
    })

    if (status === 200) {
      this.splash = data.splash
    }
  }

  public async setDiscoverySplash (path: string): Promise<void> {
    if (!this.features.includes('DISCOVERABLE')) {
      const console = Application.singleton().resolveBinding('Mineral/Core/Console')
      console.logger.warning('You do not have permission to upload a discovery banner')
    }

    const filePath = join(process.cwd(), path)
    const file = await fs.promises.readFile(filePath, 'base64')

    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status, data } = await request.patch(`/guilds/${this.id}`, {
      discovery_splash: `data:image/png;base64,${file}`
    })

    if (status === 200) {
      this.discoverySplash = data.splash
    }
  }

  public async setBanner (path: string): Promise<void> {
    const console = Application.singleton().resolveBinding('Mineral/Core/Console')
    if (!this.features.includes('DISCOVERABLE')) {
      console.logger.warning('You do not have permission to upload a banner')
    }

    const filePath = join(process.cwd(), path)
    const file = await fs.promises.readFile(filePath, 'base64')

    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status, data } = await request.patch(`/guilds/${this.id}`, {
      banner: `data:image/png;base64,${file}`
    })

    if (status === 200) {
      this.banner = data
    }
  }

  public async setSystemChannel (channel: TextChannel | Snowflake): Promise<void> {
    const value = channel instanceof TextChannel ? channel.id : channel

    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status, data } = await request.patch(`/guilds/${this.id}`, {
      system_channel_id: value
    })

    if (status === 200) {
      this.systemChannelId = data
    }
  }

  public async setSystemChannelFlag (flag: keyof typeof SystemChannelFlag): Promise<void> {
    const value = SystemChannelFlag[flag]

    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status } = await request.patch(`/guilds/${this.id}`, {
      system_channel_flags: value
    })

    if (status === 200) {
      this.systemChannelFlags = value
    }
  }

  public async setRuleChannel (channel: TextChannel | Snowflake): Promise<void> {
    const value = channel instanceof TextChannel ? channel.id : channel

    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status } = await request.patch(`/guilds/${this.id}`, {
      rules_channel_id: value
    })

    if (status === 200) {
      this.ruleChannelId = value
    }
  }

  public async setPublicUpdateChannel (channel: TextChannel | Snowflake): Promise<void> {
    const value = channel instanceof TextChannel ? channel.id : channel

    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status } = await request.patch(`/guilds/${this.id}`, {
      public_updates_channel_id: value
    })

    if (status === 200) {
      this.publicUpdateChannelId = value
    }
  }

  public async setDescription (value: string): Promise<void> {
    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    const { status } = await request.patch(`/guilds/${this.id}`, {
      description: value
    })

    if (status === 200) {
      this.description = value
    }
  }

  public async getPotentiallyKick (options?: PruneOption): Promise<number | undefined> {
    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    let url = `/guilds/${this.id}/prune?`

    if (options?.days) {
      url += `days=${options.days || 7}`
    }

    if (options?.includeRoles) {
      url += '&include_roles='
      options.includeRoles.forEach((role) => {
        const id = typeof role === 'string' ? role : role.id
        url += `${id};`
      })
    }

    const { status, data } = await request.get(url.slice(0, url.length - 1))
    if (status) {
      return data?.pruned
    }
  }

  public async pruned (options?: PruneOption & { pruneCount: boolean, reason?: string }): Promise<number | undefined> {
    const request = Application.singleton().resolveBinding('Mineral/Core/Http')

    if (options?.reason) {
      request.defineHeaders({
        'X-Audit-Log-Reason': options.reason
      })
    }

    const { status, data } = await request.post(`/guilds/${this.id}/prune`, {
      days: options?.days || 7,
      compute_prune_count: options?.pruneCount || true,
      include_roles: options?.includeRoles
        ? options?.includeRoles.map((role) => typeof role === 'string' ? role : role.id)
        : []
    })

    if (status) {
      request.resetHeaders('X-Audit-Log-Reason')
      return data?.pruned
    }
  }

  public async registerCommands () {
    const commands = Application.singleton().resolveBinding('Mineral/Core/Commands')
    const contextMenus = Application.singleton().resolveBinding('Mineral/Core/ContextMenus')
    const logger = Application.singleton().resolveBinding('Mineral/Core/Console')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')
    const request = Application.singleton().resolveBinding('Mineral/Core/Http')

    if (!commands?.collection.size) {
      return
    }

    const serializedCommands = commands.collection.map((command: any) => {
      command.logger = logger
      command.client = client

      return serializeCommand(command.data)
    })

    const serializedMenus = contextMenus.collection.map((menu: any) => {
      menu.logger = logger
      menu.client = client

      return {
        name: menu.name,
        type: CommandType[menu.type],
        permissions: menu.permissions || [],
        default_permission: menu.permissions
          ? menu.permissions?.length === 0
          : true
      }
    })

    const permissions: { id: Snowflake, permissions: { id: Snowflake, type: number, permission: boolean } }[] = []
    try {
      const { status, data } = await request.put(`/applications/${client?.application.id}/guilds/${this.id}/commands`, [...serializedCommands, ...serializedMenus])
      if (status === 200) {
        data.forEach((item) => {
          const command = item.type === CommandType.CHAT_INPUT
            ? commands.collection.get(item.name)
            : contextMenus.collection.get(item.name)

          if (command) {
            command.id = item.id
            if (command.data) {
              permissions.push({
                id: command.id,
                permissions: command.data.permissions
              })
            }
          }
        })
      }

      await request.put(`/applications/${client?.application.id}/guilds/${this.id}/commands/permissions`, permissions)
    } catch (e: any) {
      console.error(e)
    }
  }

  public async removeBulkGlobalCommand (assembler: Assembler) {
    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    try {
      await request.put(`/applications/${assembler.application.client.application.id}/commands`, {})
    } catch (e) {}
  }

  public async removeBulkCommand (assembler: Assembler) {
    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    try {
      await request.put(`/applications/${assembler.application.client.application.id}/guilds/${this.id}/commands`, {})
    } catch (e) {}
  }

  public toString (): string {
    return this.name
  }
}