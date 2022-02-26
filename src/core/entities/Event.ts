import Logger from '@mineralts/logger'
import { Client, ClientEvents } from '../../typing/interfaces'

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