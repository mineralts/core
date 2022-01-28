import Collection from '../../utils/Collection'
import {
  ExplicitContentLevel, Feature, GuildFeature, LocalPath, Milliseconds,
  NotificationLevel,
  Region,
  Snowflake, SystemChannelFlag,
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
import { serializeCommand } from '../../utils'
import Assembler from '../../../assembler/Assembler'
import { MineralCommand } from '../../../core/entities/Command'

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

  public hasFeature(feature: keyof typeof Feature): boolean {
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
    const data =  await request.patch(`/guilds/${this.id}`, {
      icon: null
    })

    if (data) {
      this.icon = data.icon
    }
  }

  public async setOwner (member: GuildMember | Snowflake): Promise<void> {
    const client = Application.getClient()
    const value = member instanceof GuildMember ? member.id :member

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
    const value = channel instanceof TextChannel ? channel.id :channel

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

  public async registerCommands (assembler: Assembler) {
    const container = assembler.application.container

    if (!container.commands.size) {
      return
    }

    const request = Application.createRequest()

    const commands = container.commands.filter((command: any) => (
      command.data.scope === 'GUILD'
    ))

    await Promise.all(
      container.subcommands.map((subcommand: any) => {
        const parent = assembler.application.container.commands.find((command: any) => (
          command.data.label === subcommand.data.parent[0]
        )) as MineralCommand & { data: any }

        if (!parent) {
          const logger = Application.getLogger()
          logger.fatal(`Subcommand ${subcommand.data.parent[0]}.${subcommand.data.label} is invalid because it is not associated with any parent command.`)
          process.exit(1)
        }

        parent.data.options.push({
          name: subcommand.data.label,
          description: subcommand.data.description,
          options: subcommand.data.options,
          type: 'SUB_COMMAND'
        })
      })
    )

    await Promise.all(
      commands.map(async (command: any) => {
        const payload = await request.post(`/applications/${assembler.application.client.application.id}/guilds/${this.id}/commands`, {
          ...serializeCommand(command.data)
        })

        command.id = payload.id
        command.guild = this

        this.commands.set(command.id!, command as unknown as Command)
      })
    )
  }
}