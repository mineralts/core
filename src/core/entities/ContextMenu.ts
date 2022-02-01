import { CommandType } from '../../api/types'
import Logger from '@mineralts/logger'
import { Client } from '../../api/entities'
import MenuInteraction from '../../typing/interfaces/interaction/MenuInteraction'

export function ContextMenu (type: Exclude<keyof typeof CommandType, 'CHAT_INPUT'>, name: string) {
  return (target: any) => {
    target.identifier = 'contextmenu'
    target.prototype.type = type
    target.prototype.name = name
  }
}

export abstract class MineralContextMenu {
  public logger: Logger
  public client: Client
  abstract run (interaction: MenuInteraction): Promise<void>
}