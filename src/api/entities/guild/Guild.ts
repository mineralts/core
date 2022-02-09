import Collection from '../../utils/Collection'
import {
  CommandType,
  ExplicitContentLevel,
  Feature,
  GuildFeature,
  LocalPath,
  Milliseconds,
  NotificationLevel, PruneOption,
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
    const request = Application.createRequest()
    const result = await request.patch(`/guilds/${this.id}`, { name: value })

    if (result) {
      this.name = value
    }
  }

  public async setPreferredLocale (region: keyof typeof Region): Promise<void> {
    const request = Application.createRequest()
    await request.patch(`/guilds/${this.id}`, {
      preferred_locale: region
    })

    this.region = region
  }

  public async leave (): Promise<void> {
    const client = Application.getClient()
    if (this.ownerId === client.user.id) {
      throw new Error('GUILD_OWNER')
    }

    const request = Application.createRequest()
    const result = await request.delete(`/guilds/${this.id}`)
    if (result) {
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

    const request = Application.createRequest()
    const result = await request.patch(`/guilds/${this.id}`, {
      afk_channel_id: value
    })

    if (result) {
      this.afkChannelId = value
    }
  }

  public async setVerificationLevel (level: keyof typeof VerificationLevel): Promise<void> {
    const value = VerificationLevel[level]

    const request = Application.createRequest()
    const result = await request.patch(`/guilds/${this.id}`, {
      verification_level: value
    })

    if (result) {
      this.verificationLevel = value
    }
  }

  public async setNotificationLevel (level: keyof typeof NotificationLevel): Promise<void> {
    const request = Application.createRequest()
    const result = await request.patch(`/guilds/${this.id}`, {
      default_message_notifications: NotificationLevel[level]
    })

    if (result) {
      this.defaultMessageNotifications = level
    }
  }

  public async setExplicitContentFilter (level: keyof typeof ExplicitContentLevel): Promise<void> {
    const explicitContentFilter = ExplicitContentLevel[level]

    const request = Application.createRequest()
    const result = await request.patch(`/guilds/${this.id}`, {
      explicit_content_filter: explicitContentFilter
    })

    if (result) {
      this.explicitContentFilter = explicitContentFilter
    }
  }

  public async setAfkTimeout (value: Milliseconds): Promise<void> {
    const request = Application.createRequest()
    const result = await request.patch(`/guilds/${this.id}`, {
      afk_timeout: value
    })

    if (result) {
      this.afkTimeout = value
    }
  }

  public hasFeature (feature: keyof typeof Feature): boolean {
    return this.features.includes(feature)
  }

  public async setIcon (path: LocalPath): Promise<void> {
    if (!this.hasFeature('ANIMATED_ICON') && path.split('.')[1] === 'gif') {
      const logger = Application.getLogger()
      logger.error('You do not have permission to upload a invitation banner')
    }

    const filePath = join(process.cwd(), path)
    const file = await fs.promises.readFile(filePath, 'base64')

    const request = Application.createRequest()
    const data = await request.patch(`/guilds/${this.id}`, {
      icon: `data:image/png;base64,${file}`
    })

    if (data) {
      this.icon = data.icon
    }
  }

  public async removeIcon (): Promise<void> {
    const request = Application.createRequest()
    const data = await request.patch(`/guilds/${this.id}`, {
      icon: null
    })

    if (data) {
      this.icon = data.icon
    }
  }

  public async setOwner (member: GuildMember | Snowflake): Promise<void> {
    const client = Application.getClient()
    const value = member instanceof GuildMember ? member.id : member

    if (this.ownerId === client.user.id) {
      throw new Error('OWNERISALREADYMEMBER')
    }

    const request = Application.createRequest()
    const result = await request.patch(`/guilds/${this.id}`, {
      owner_id: value
    })

    if (result) {
      this.ownerId = value
      this.owner = this.members.cache.get(value)!
    }
  }

  public async setSplash (path: string): Promise<void> {
    if (!this.features.includes('INVITE_SPLASH')) {
      const logger = Application.getLogger()
      logger.warn('You do not have permission to upload a invitation banner')
    }

    const filePath = join(process.cwd(), path)
    const file = await fs.promises.readFile(filePath, 'base64')

    const request = Application.createRequest()
    const result = await request.patch(`/guilds/${this.id}`, {
      splash: `data:image/png;base64,${file}`
    })

    if (result) {
      this.splash = result.splash
    }
  }

  public async setDiscoverySplash (path: string): Promise<void> {
    if (!this.features.includes('DISCOVERABLE')) {
      const logger = Application.getLogger()
      logger.warn('You do not have permission to upload a discovery banner')
    }

    const filePath = join(process.cwd(), path)
    const file = await fs.promises.readFile(filePath, 'base64')

    const request = Application.createRequest()
    const result = await request.patch(`/guilds/${this.id}`, {
      discovery_splash: `data:image/png;base64,${file}`
    })

    if (result) {
      this.discoverySplash = result.splash
    }
  }

  public async setBanner (path: string): Promise<void> {
    if (!this.features.includes('DISCOVERABLE')) {
      const logger = Application.getLogger()
      logger.warn('You do not have permission to upload a banner')
    }

    const filePath = join(process.cwd(), path)
    const file = await fs.promises.readFile(filePath, 'base64')

    const request = Application.createRequest()
    const result = await request.patch(`/guilds/${this.id}`, {
      banner: `data:image/png;base64,${file}`
    })

    if (result) {
      this.banner = result
    }
  }

  public async setSystemChannel (channel: TextChannel | Snowflake): Promise<void> {
    const value = channel instanceof TextChannel ? channel.id : channel

    const request = Application.createRequest()
    const result = await request.patch(`/guilds/${this.id}`, {
      system_channel_id: value
    })

    if (result) {
      this.systemChannelId = result
    }
  }

  public async setSystemChannelFlag (flag: keyof typeof SystemChannelFlag): Promise<void> {
    const value = SystemChannelFlag[flag]

    const request = Application.createRequest()
    const result = await request.patch(`/guilds/${this.id}`, {
      system_channel_flags: value
    })

    if (result) {
      this.systemChannelFlags = value
    }
  }

  public async setRuleChannel (channel: TextChannel | Snowflake): Promise<void> {
    const value = channel instanceof TextChannel ? channel.id : channel

    const request = Application.createRequest()
    const result = await request.patch(`/guilds/${this.id}`, {
      rules_channel_id: value
    })

    if (result) {
      this.ruleChannelId = value
    }
  }

  public async setPublicUpdateChannel (channel: TextChannel | Snowflake): Promise<void> {
    const value = channel instanceof TextChannel ? channel.id : channel

    const request = Application.createRequest()
    const result = await request.patch(`/guilds/${this.id}`, {
      public_updates_channel_id: value
    })

    if (result) {
      this.publicUpdateChannelId = value
    }
  }

  public async setDescription (value: string): Promise<void> {
    const request = Application.createRequest()
    const result = await request.patch(`/guilds/${this.id}`, {
      description: value
    })

    if (result) {
      this.description = value
    }
  }

  public async getPotentiallyKick (options?: PruneOption): Promise<number | undefined> {
    const request = Application.createRequest()
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

    const payload = await request.get(url.slice(0, url.length - 1))
    return payload?.pruned
  }

  public async registerCommands (assembler: Assembler) {
    const container = assembler.application.container
    const request = Application.createRequest()

    if (!container.commands.size) {
      return
    }

    const serializedCommands = container.commands.map((command: any) => {
      command.logger = assembler.application.logger
      command.client = assembler.application.client

      return serializeCommand(command.data)
    })

    const serializedMenus = container.menus.map((menu: any) => {
      menu.logger = assembler.application.logger
      menu.client = assembler.application.client

      return {
        name: menu.name,
        type: CommandType[menu.type],
        permissions: menu.permissions || [],
        default_permission: menu.permissions
          ? menu.permissions?.length === 0
          : true,
      }
    })

    const permissions: { id: Snowflake, permissions: { id: Snowflake, type: number, permission: boolean } }[] = []
    const payload = await request.put(`/applications/${assembler.application.client.application.id}/guilds/${this.id}/commands`, [...serializedCommands, ...serializedMenus])
    if (payload) {
      payload.forEach((item) => {
        const command = item.type === CommandType.CHAT_INPUT
          ? container.commands.get(item.name)
          : container.menus.get(item.name)

        if (command) {
          command.id = item.id
          if (command.data) {
            permissions.push({
              id: command.id,
              permissions: command.data.permissions,
            })
          }
        }
      })

      await request.put(`/applications/${assembler.application.client.application.id}/guilds/${this.id}/commands/permissions`, permissions)
    }
  }

  public async removeBulkGlobalCommand (assembler: Assembler) {
    const request = Application.createRequest()
    await request.put(`/applications/${assembler.application.client.application.id}/commands`, {})
  }

  public async removeBulkCommand (assembler: Assembler) {
    const request = Application.createRequest()
    await request.put(`/applications/${assembler.application.client.application.id}/guilds/${this.id}/commands`, {})
  }

  public toString (): string {
    return this.name
  }
}