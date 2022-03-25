import Console from '@poppinss/cliui'
import { Client, ClientEvents } from '../../typing/interfaces'

export function Event (event: keyof ClientEvents) {
  return (target: any) => {
    target.identifier = 'event'
    target.event = event
  }
}

export abstract class MineralEvent {
  public console: typeof Console
  public client: Client
  abstract run (...args: any[]): Promise<void>
}