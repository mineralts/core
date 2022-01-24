import Logger from '@mineralts/logger'
import { CommandOption, OptionType, Snowflake } from '../../api/types'
import { Client } from '../../api/entities'

export function Command (name: string, description: string, scope: 'GUILDS' | Snowflake) {
  return (target: any) => {
    target.identifier = 'slash-command'

    if (!target.prototype.data) {
      target.prototype.data = {
        options: []
      }
    }

    target.prototype.data.label = name.toLowerCase()
    target.prototype.data.scope = scope
    target.prototype.data.description = description
  }
}

export function Subcommand (parent: string, name: string, description: string) {
  return (target: any) => {
    if (!target.prototype.data) {
      target.prototype.data = {}
    }

    target.identifier = 'subcommand'
    target.prototype.data.parent = parent.toLowerCase().split('.')
    target.prototype.data.label = name.toLowerCase()
    target.prototype.data.description = description
  }
}

export function Option<T extends keyof typeof OptionType | 'CHOICE'> (type: T, opt: CommandOption<T>) {
  return (target: any) => {
    if (!target.prototype.data) {
      target.prototype.data = {}
    }

    if (!target.prototype.data.options) {
      target.prototype.data.options = []
    }

    target.prototype.data.options.push({ type, ...opt })
  }
}

export abstract class MineralCommand {
  public logger!: Logger
  public client!: Client

  public getLabel!: () => string
  public getDescription!: () => string

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public getOption<T extends keyof typeof OptionType | 'CHOICE'> (type: T, name: string): CommandOption<T>

  abstract run (...args: any[]): Promise<void>
}