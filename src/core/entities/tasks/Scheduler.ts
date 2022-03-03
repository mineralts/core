import { schedule, ScheduledTask } from 'node-cron'
import Application from '../../../application/Application'

export default class Scheduler {
  public task: ScheduledTask
  private schedulers = Application.singleton().resolveBinding('Mineral/Core/Tasks')

  constructor (public identifier: string, private cron: string, private cb: (task: ScheduledTask) => Promise<void>) {
    this.task = schedule(this.cron, () => {
      this.task.emit(`task:${this.identifier}`)
    })

    this.schedulers.collection.set(this.identifier, this)
  }

  public start () {
    this.task.on(`task:${this.identifier}`, async () => {
      await this.cb.call({
        logger: Application.getLogger(),
        client: Application.getClient()
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