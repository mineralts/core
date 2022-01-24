import Logger from '@mineralts/logger'
import { ClientEvents } from '../../api/types'
import { Client } from '../../api/entities'

export function Event (event: keyof ClientEvents) {
  return (target: any) => {
    target.identifier = 'event'
    target.event = event
  }
}

export abstract class MineralEvent {
  public logger!: Logger
  public client!: Client
  abstract run (...args: any[]): Promise<void>
}