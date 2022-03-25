import { CommandType, Snowflake } from '../../api/types'
import Console from '@poppinss/cliui'
import MenuInteraction from '../../typing/interfaces/interaction/MenuInteraction'
import { Client } from '../../typing/interfaces'

export function ContextMenu (type: Exclude<keyof typeof CommandType, 'CHAT_INPUT'>, name: string) {
  return (target: any) => {
    target.identifier = 'contextmenu'
    target.prototype.type = type
    target.prototype.name = name
    target.prototype.data = {}
    target.permissions = target.prototype.permissions || []
  }
}

export abstract class MineralContextMenu {
  public id: Snowflake
  public console: typeof Console
  public client: Client
  public data: any

  abstract run (interaction: MenuInteraction): Promise<void>
}