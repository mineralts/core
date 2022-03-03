/*
 * @mineralts/core
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import Logger from '@mineralts/logger'
import { Intent } from './types'
import fs from 'fs'
import Collection from '../api/utils/Collection'
import Helper from '../helper'
import Container from './Container'
import Reflect from '../reflect/Reflect'
import Client from '../api/entities/client'
import { join } from 'node:path'
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

  public logger: Logger = new Logger()
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
    const jsonPackage = this.loadFileSync(process.cwd(), 'package.json')
    const rcFile = this.loadFileSync(process.cwd(), '.mineralrc.json', 'The .mineralrc.json file was not found at the root of the project.')

    this.ioc.registerBinding('Mineral/Core/Logger', new Logger())
    this.ioc.registerBinding('Mineral/Core/Emitter', new EventsListener())
    this.ioc.registerBinding('Mineral/Core/Environment', new MineralEnvironmentService())
    this.ioc.registerBinding('Mineral/Core/Helpers', new Helper())
    this.ioc.registerBinding('Mineral/Core/Providers', new MineralProviderService())
    this.ioc.registerBinding('Mineral/Core/Cli', new MineralCliService())
    this.ioc.registerBinding('Mineral/Core/Events', new MineralEventService())
    this.ioc.registerBinding('Mineral/Core/Commands', new MineralCommandService())
    this.ioc.registerBinding('Mineral/Core/Tasks', new MineralTaskService())
    this.ioc.registerBinding('Mineral/Core/ContextMenus', new MineralContextMenusService())

    const environment = this.ioc.resolveBinding('Mineral/Core/Environment')

    environment?.registerKey('appName', jsonPackage.name)
    environment?.registerKey('appVersion', jsonPackage.version)
    environment?.registerKey('root', process.cwd())
    environment?.registerKey('debug', false)
    environment?.registerKey('reflect', false)
    environment?.registerKey('rcFile', rcFile)
    environment?.registerKey('mode', process.env.NODE_ENV as any)

    const dependencies: { [K: string]: unknown }[] = []
    Object.entries(jsonPackage.dependencies).forEach(([key, version]) => {
      if (key.startsWith('@mineralts')) {
        dependencies.push({ [key]: version })
      }
    })

    environment?.registerKey('mineralDependencies', dependencies)
    environment?.resolveEnvironment()

    const intents: 'ALL' | Exclude<keyof typeof Intent, 'ALL'>[] = 'ALL'
    environment?.registerKey('intents', { selected: intents, bitfield: this.getIntentValue(intents) })

    const useReflect = environment?.resolveKey('reflect')
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

  public static getLogger () {
    const instance = this.getInstance()
    return instance.logger
  }

  public static singleton () {
    const instance = this.getInstance()
    return instance.ioc
  }

  public static getHelper (): Helper {
    const instance = this.getInstance()
    return instance.helper
  }

  protected loadFileSync (location: string, filename: string, message?: string) {
    try {
      return JSON.parse(fs.readFileSync(join(location, filename), 'utf-8'))
    } catch (error) {
      throw new Error(
        message || `The file ${filename} at location ${location} was not found.`
      )
    }
  }
}