import Logger from '@mineralts/logger'
import { CommandOption, CommandOptionType, OptionType, Snowflake } from '../../api/types'
import { Client } from '../../api/entities'
import Application from '../../application/Application'

export function Command (name: string, description: string, scope: 'GUILDS' | Snowflake, hasSubcommands?: boolean) {
  return (target: any) => {
    target.identifier = 'command'
    target.label = name.toLowerCase()

    const container = Application.getContainer()
    const command = new target() as MineralBaseCommand & { data: any }

    command.hasSubcommands = hasSubcommands || false
    command.data = {
      label: name.toLowerCase(),
      scope: scope,
      description: description,
      options: hasSubcommands
        ? Object.values(target.prototype.subcommands)
        : target.prototype.commandOptions
    }

    container.commands.set(command.data.label, command)
  }
}

export function Subcommand (description: string) {
  return (target, propertyKey: string) => {
    if (!target.constructor.prototype.subcommands) {
      target.constructor.prototype['subcommands'] = []
    }

    target.constructor.prototype.subcommands[propertyKey] = {
      type: 'SUB_COMMAND',
      name: propertyKey.toLowerCase(),
      description,
      options: target.options
    }

    target.options = []
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

    target.prototype.commandOptions.push({type, ...options})
    target.options.push({ type, ...options })
  }
}

export abstract class MineralBaseCommand {
  public id: string
  public logger: Logger
  public client: Client
  public hasSubcommands: boolean
  public data: any

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public getOption<T extends keyof typeof OptionType | 'CHOICE'> (type: T, name: string): CommandOption<T>
}

export abstract class MineralCommand extends MineralBaseCommand {
  abstract run (...args: any[]): Promise<void>
}

export abstract class MineralSubcommand extends MineralBaseCommand {
}