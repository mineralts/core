import { Snowflake } from '../../types'
import User from '../user'
import { DateTime } from 'luxon'
import Guild from './Guild'
import GuildMemberRoleManager from './GuildMemberRoleManager'
import Role from '../roles'
import VoiceState from '../voice/VoiceState'
import Application from '../../../application/Application'

export default class GuildMember {
  constructor (
    public id: Snowflake,
    public username: string,
    public user: User,
    public guild: Guild,
    public roles: GuildMemberRoleManager,
    public highestRole: Role | null,
    public pending: boolean,
    public voice: VoiceState,
    public communicationTimeout: DateTime | null,
    public joinedAt: DateTime,
  ) {
  }

  public isPending (): boolean {
    return this.pending
  }

  public async setUsername (value: string) {
    const request = Application.createRequest()

    await request.patch(`/guilds/${this.guild.id}/members/${this.id}`, {
      nick: value
    })
  }

  public async exclude (date: DateTime, reason?: string) {
    const request = Application.createRequest()

    if (reason) {
      request.defineHeaders({
        'X-Audit-Log-Reason': reason
      })
    }

    await request.patch(`/guilds/${this.guild.id}/members/${this.id}`, {
      communication_disabled_until: date.toISO()
    })

    request.resetHeaders('X-Audit-Log-Reason')
  }

  public async sorry (reason?: string) {
    const request = Application.createRequest()

    if (reason) {
      request.defineHeaders({
        'X-Audit-Log-Reason': reason
      })
    }

    await request.patch(`/guilds/${this.guild.id}/members/${this.id}`, {
      communication_disabled_until: null
    })

    request.resetHeaders('X-Audit-Log-Reason')
  }
  
  public async ban (options: { messageCount?: number, reason?: string }) {
    const request = Application.createRequest()

    if (options.messageCount && (options.messageCount < 0 || options.messageCount > 50)) {
      const logger = Application.getLogger()
      logger.error(`You can delete between 0 and 7 days only (${options.messageCount} set).`)
      return
    }

    if (options.reason) {
      request.defineHeaders({
        'X-Audit-Log-Reason': options.reason
      })
    }

    await request.patch(`/guilds/${this.guild.id}/bans/${this.id}`, {
      delete_message_days: options.messageCount,
      reason: options.reason
    })

    request.resetHeaders('X-Audit-Log-Reason')
  }

  public async unban (reason?: string) {
    const request = Application.createRequest()

    if (reason) {
      request.defineHeaders({
        'X-Audit-Log-Reason': reason
      })
    }

    await request.delete(`/guilds/${this.guild.id}/bans/${this.id}`)
    request.resetHeaders('X-Audit-Log-Reason')
  }

  public async kick (reason?: string) {
    const request = Application.createRequest()

    if (reason) {
      request.defineHeaders({
        'X-Audit-Log-Reason': reason
      })
    }

    await request.delete(`/guilds/${this.guild.id}/members/${this.id}`)
    request.resetHeaders('X-Audit-Log-Reason')
  }

  public toString (): string {
    return `<@${this.username ? '!' : ''}${this.user.id}>`
  }
}