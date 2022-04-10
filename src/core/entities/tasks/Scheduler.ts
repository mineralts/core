import { schedule, ScheduledTask } from 'node-cron'
import Ioc from '../../../Ioc'

export default class Scheduler {
  public task: ScheduledTask
  private schedulers = Ioc.singleton().resolve('Mineral/Core/Tasks')

  constructor (public identifier: string, private cron: string, private cb: (task: ScheduledTask) => Promise<void>) {
    this.task = schedule(this.cron, () => {
      this.task.emit(`task:${this.identifier}`)
    })

    this.schedulers.collection.set(this.identifier, this)
  }

  public start () {
    const console = Ioc.singleton().resolve('Mineral/Core/Console')
    this.task.on(`task:${this.identifier}`, async () => {
      await this.cb.call({
        console: console,
        client: Ioc.singleton().resolve('Mineral/Core/Client')
      }, this.task)
    })

    this.task.start()
  }

  public stop () {
    this.task.stop()
    const scheduler = this.schedulers.collection.get(this.identifier)
    scheduler?.stop()
  }
}