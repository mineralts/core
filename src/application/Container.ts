import Collection from '../api/utils/Collection'

export default class Container {
  public services: Collection<string, unknown> = new Collection()

  public resolveBinding (binding: string) {
    return this.services.get(binding)
  }

  public registerBinding<T> (binding: string, service: T) {
    if (this.resolveBinding(binding)) {
      throw new Error(`The ${binding} service already exists.`)
    }
    this.services.set(binding, service)
  }
}