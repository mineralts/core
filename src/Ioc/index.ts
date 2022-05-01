import Collection from '../api/utils/Collection'
import EventsListener from '../assembler/EventsListener'
import MineralEnvironmentService from '../core/services/MineralEnvironmentService'
import MineralProviderService from '../core/services/MineralProviderService'
import MineralCliService from '../core/services/MineralCliService'
import MineralEventService from '../core/services/MineralEventService'
import MineralCommandService from '../core/services/MineralCommandService'
import Client from '../api/entities/client'
import Connector from '../connector/Connector'
import Helper from '../helper'
import Reflect from '../reflect/Reflect'
import MineralContextMenusService from '../core/services/MineralContextMenusService'
import MineralTaskService from '../core/services/MineralTaskService'
import Http from '../connector/http'
import Logger from '@poppinss/cliui'

export interface ServiceContract {
  'Mineral/Core/Client': Client
  'Mineral/Core/Console': typeof Logger
  'Mineral/Core/Emitter': EventsListener
  'Mineral/Core/Events': MineralEventService
  'Mineral/Core/Commands': MineralCommandService
  'Mineral/Core/ContextMenus': MineralContextMenusService
  'Mineral/Core/Tasks': MineralTaskService
  'Mineral/Core/Cli': MineralCliService
  'Mineral/Core/Environment': MineralEnvironmentService
  'Mineral/Core/Providers': MineralProviderService
  'Mineral/Core/Connector': Connector
  'Mineral/Core/Http': Http
  'Mineral/Core/Helpers': Helper
  'Mineral/Core/Reflect': Reflect
}

type ServiceType<T> = T extends keyof ServiceContract ? ServiceContract[T] : any

export default class Ioc {
  private static $instance: Ioc
  public services: Collection<string, unknown> = new Collection()

  public static create () {
    this.$instance = new Ioc()
    return this.$instance
  }

  public static singleton () {
    return this.$instance
  }

  public resolve<T extends keyof ServiceContract | string> (binding: T): ServiceType<T> {
    const service = this.services.get(binding)

    if (!service) {
      throw new Error(`The ${binding} service was not found.`)
    }

    return service as ServiceType<T>
  }

  public registerBinding<T extends keyof ServiceContract | string> (binding: T, service: ServiceType<T>): void {
    this.services.set(binding, service)
  }
}