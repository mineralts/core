import { ComponentType, MessageComponentResolvable } from '../../types'
import Ioc from '../../../Ioc'

export default class EmbedRow {
  public type: ComponentType = ComponentType.ACTION_ROW
  public components: MessageComponentResolvable[] = new Proxy([], {
    set: function(target: MessageComponentResolvable[], property: string | symbol, value) {
      if (target.length > 5) {
        const console = Ioc.singleton().resolve('Mineral/Core/Console')
        console.logger.error(new Error(`A row can contain a maximum of 5 components, ${target.length}.`))
        process.exit(1)
      }
      target[property] = value
      return true
    }
  })

  public addComponent (component: MessageComponentResolvable) {
    this.components.push(component)
    return this
  }

  public addComponents (components: MessageComponentResolvable[]) {
    components.forEach((component: MessageComponentResolvable) => {
      this.components.push(component)
    })
    return this
  }
}