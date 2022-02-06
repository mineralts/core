import Logger from '@mineralts/logger'
import { CommandOption, CommandOptionType, PermissionType, Snowflake } from '../../api/types'
import { Client } from '../../api/entities'
import Application from '../../application/Application'

export function Command (name: string, description: string, scope: 'GUILDS' | Snowflake) {
  return (target: any) => {
    target.identifier = 'command'
    target.label = name.toLowerCase()

    const container = Application.getContainer()
    const command = new target() as MineralBaseCommand & { data: any }

    command.hasSubcommands = target.prototype.subcommands
      ? Object.values(target.prototype.subcommands)?.length !== 0
      : false

    command.data = {
      label: name.toLowerCase(),
      scope: scope,
      description: description,
      default_permission: target.prototype.permissions
        ? target.prototype.permissions?.length === 0
        : true,
      permissions: command.hasSubcommands ? [] : target.prototype.permissions,
      options: command.hasSubcommands
        ? Object.values(target.prototype.subcommands)
        : target.prototype.commandOptions
          ? target.prototype.commandOptions.reverse()
          : []
        || []
    }

    container.commands.set(command.data.label, command)
  }
}

export function Subcommand (description: string) {
  return (target, propertyKey: string) => {
    if (!target.constructor.prototype.subcommands) {
      target.constructor.prototype['subcommands'] = {}
    }

    target.constructor.prototype.subcommands[propertyKey] = {
      type: 'SUB_COMMAND',
      name: propertyKey.toLowerCase(),
      description,
      permissions: target.permissions,
      options: target.options.reverse()
    }

    target.options = []
  }
}

export function Permission (type: keyof typeof PermissionType, can: boolean, ...ids: Snowflake[]): any {
  return (target: any) => {
    if (!target.permissions) {
      target['permissions'] = []
    }
    if (!target.prototype) {
      target.prototype = {}
    }

    if (!target.prototype.permissions) {
      target.prototype['permissions'] = []
    }

    target.prototype.permissions = [
      ...target.prototype.permissions,
      ...ids.map((id: Snowflake) => (
        { id, type: PermissionType[type], permission: can }
      ))
    ]
  }
}

export function Option<T extends keyof typeof CommandOptionType | 'CHOICE'> (type: T, options: CommandOption<T>): any {
  return (target: any) => {
    if (!target.options) {
      target['options'] = []
    }

    if (!target.prototype) {
      target.prototype = {}
    }

    if (!target.prototype.commandOptions) {
      target.prototype['commandOptions'] = []
    }

    target.prototype.commandOptions.push({ type, ...options })
    target.options.push({ type, ...options })
  }
}

export abstract class MineralBaseCommand {
  public id: string
  public logger: Logger
  public client: Client
  public hasSubcommands: boolean
  public data: any
}

export abstract class MineralCommand extends MineralBaseCommand {
  abstract run (...args: any[]): Promise<void>
}

export abstract class MineralSubcommand extends MineralBaseCommand {
}