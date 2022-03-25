import { logger as Logger } from '@poppinss/cliui'
import { ScheduledTask } from 'node-cron'
import Client from '../../../api/entities/client'

export function Task (name: string, cron: string) {
  return (target: any) => {
    target.identifier = 'scheduler'
    target.id = name
    target.cron = cron
  }
}

export abstract class MineralTask {
  public name: string
  public logger: typeof Logger
  public client: Client
  abstract run (task: ScheduledTask): Promise<void>
}