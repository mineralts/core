/*
 * @mineralts/core
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import * as Console from '@poppinss/cliui'
import { Intent } from './types'
import Collection from '../api/utils/Collection'
import Helper from '../helper'
import Container from './Container'
import Reflect from '../reflect/Reflect'
import Client from '../api/entities/client'
import MineralEnvironmentService from '../core/services/MineralEnvironmentService'
import EventsListener from '../assembler/EventsListener'
import MineralCliService from '../core/services/MineralCliService'
import MineralEventService from '../core/services/MineralEventService'
import MineralCommandService from '../core/services/MineralCommandService'
import MineralTaskService from '../core/services/MineralTaskService'
import MineralContextMenusService from '../core/services/MineralContextMenusService'
import MineralProviderService from '../core/services/MineralProviderService'

export default class Application {
  private static $instance: Application
  public reflect: Reflect | undefined

  public readonly appName: string
  public readonly version: string
  public readonly debug: boolean

  public static cdn = 'https://cdn.discordapp.com'

  public commands: Collection<string, any> = new Collection()

  public ioc: Container = new Container()

  public helper: Helper = new Helper()
  public client!: Client
  public readonly intents: number

  public setup () {
    this.ioc.registerBinding('Mineral/Core/Console', Console)
    this.ioc.registerBinding('Mineral/Core/Emitter', new EventsListener())
    this.ioc.registerBinding('Mineral/Core/Environment', new MineralEnvironmentService())

    const environment = this.ioc.resolveBinding('Mineral/Core/Environment')
    const jsonPackage = environment.loadFileSync(process.cwd(), 'package.json')
    const rcFile = environment.loadFileSync(process.cwd(), '.mineralrc.json', 'The .mineralrc.json file was not found at the root of the project.')

    this.ioc.registerBinding('Mineral/Core/Helpers', new Helper())
    this.ioc.registerBinding('Mineral/Core/Providers', new MineralProviderService())
    this.ioc.registerBinding('Mineral/Core/Cli', new MineralCliService())
    this.ioc.registerBinding('Mineral/Core/Events', new MineralEventService())
    this.ioc.registerBinding('Mineral/Core/Commands', new MineralCommandService())
    this.ioc.registerBinding('Mineral/Core/Tasks', new MineralTaskService())
    this.ioc.registerBinding('Mineral/Core/ContextMenus', new MineralContextMenusService())

    environment?.registerKey('APP_NAME', jsonPackage.name)
    environment?.registerKey('APP_VERSION', jsonPackage.version)
    environment?.registerKey('APP_ROOT', process.cwd())
    environment?.registerKey('APP_DEBUG', false)
    environment?.registerKey('REFLECT', false)
    environment?.registerKey('RC_FILE', rcFile)
    environment?.registerKey('APP_MODE', process.env.NODE_ENV as any)

    const dependencies: { [K: string]: unknown }[] = []
    Object.entries(jsonPackage.dependencies).forEach(([key, version]) => {
      if (key.startsWith('@mineralts')) {
        dependencies.push({ [key]: version })
      }
    })

    environment?.registerKey('MINERAL_DEPENDENCIES', dependencies)
    environment?.resolveEnvironment()

    const intents: 'ALL' | Exclude<keyof typeof Intent, 'ALL'>[] = 'ALL'
    environment?.registerKey('INTENTS', { selected: intents, bitfield: this.getIntentValue(intents) })

    const useReflect = environment?.resolveKey('REFLECT')
    if (useReflect) {
      const reflect = new Reflect()
      reflect.createClient()

      this.ioc.registerBinding('Mineral/Core/Reflect', reflect)
    }
  }

  public getIntentValue (intents: 'ALL' | Exclude<keyof typeof Intent, 'ALL'>[]) {
    return intents
      ? intents === 'ALL'
        ? Intent[intents]
        : intents.reduce((acc: number, current: keyof typeof Intent) => acc + Intent[current], 0)
      : 0
  }

  private static getInstance () {
    return this.$instance
  }

  public static create () {
    if (!this.$instance) {
      this.$instance = new Application()
    }
    return this.$instance
  }

  public static getClient () {
    const instance = this.getInstance()
    return instance.client
  }

  public static singleton () {
    const instance = this.getInstance()
    return instance.ioc
  }

  public static getHelper (): Helper {
    const instance = this.getInstance()
    return instance.helper
  }
}