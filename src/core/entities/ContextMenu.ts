import { CommandType, Snowflake } from '../../api/types'
import Logger from '@mineralts/logger'
import { Client } from '../../api/entities'
import MenuInteraction from '../../typing/interfaces/interaction/MenuInteraction'

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
  public logger: Logger
  public client: Client
  public data: any

  abstract run (interaction: MenuInteraction): Promise<void>
}