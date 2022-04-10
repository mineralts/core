import Collection from '../../api/utils/Collection'
import { MineralEvent } from '../entities/Event'
import Ioc from '../../Ioc'
import { Client } from '../../typing/interfaces'

export default class MineralEventService {
  public collection: Collection<string, Collection<string, MineralEvent>> = new Collection()

  public register (path, item: { new (): MineralEvent, event: string }) {
    const console = Ioc.singleton().resolve('Mineral/Core/Console')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')

    const event = new item() as MineralEvent & { event: string }
    event.console = console
    event.client = client as unknown as Client

    const eventContainer = this.collection.get(item.event)

    if (!eventContainer) {
      const events: Collection<string, MineralEvent> = new Collection()
      this.collection.set(
        item.event,
        events.set(path, event)
      )
    } else {
      eventContainer.set(path, event)
    }

    emitter.on(item.event, async (...args: any[]) => {
      await event.run(...args)
    })
  }
}