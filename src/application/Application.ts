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
import { Intent, RcFile } from './types'
import { Http } from '@mineralts/connector-preview'
import path from 'path'
import fs from 'fs'
import Environment from '../environment/Environment'
import Collection from '../api/utils/Collection'
import { Client } from '../api/entities'
import Helper from '../helper'
import Container from './Container'

export default class Application {
  private static $instance: Application

  public environment: Environment = new Environment()
  public logger: Logger = new Logger()
  public request!: Http
  public apiSequence: number

  public readonly appName: string
  public readonly version: string
  public readonly debug: boolean

  public readonly mode: string = 'development'
  public static cdn = 'https://cdn.discordapp.com'

  public rcFile: RcFile
  public preloads: any[]
  public commands: Collection<string, any> = new Collection()
  public statics: string[]

  public aliases: Map<string, string> = new Map()

  public container: Container = new Container()

  public helper: Helper = new Helper()
  public client!: Client
  public readonly intents: number

  constructor (public readonly appRoot: string, environment: any) {
    this.environment.registerEnvironment()

    this.appName = environment.appName
    this.version = environment.version
    this.debug = this.environment.cache.get('DEBUG') || false
    this.rcFile = environment.rcFile
    this.preloads = this.rcFile.preloads
    this.statics = this.rcFile.statics
    this.aliases = new Map(Object.entries(this.rcFile.aliases))

    const intents: 'ALL' | Exclude<keyof typeof Intent, 'ALL'>[] = 'ALL'
    this.intents = this.getIntentValue(intents)
  }

  public getIntentValue (intents: 'ALL' | Exclude<keyof typeof Intent, 'ALL'>[]) {
    return intents
      ? intents === 'ALL'
        ? Intent[intents]
        : intents.reduce((acc: number, current: keyof typeof Intent) => acc + Intent[current], 0)
      : 0
  }

  public registerBinding<T> (key: string, value: T) {
    this[key] = value
  }

  public async registerCliCommands () {
    const commands = this.rcFile.commands

    const invalidLocation = commands.filter((location) => (
      location.startsWith('./') || location.startsWith('/')
    ))

    if (invalidLocation.length) {
      this.logger.fatal('The pre-loaded commands must be commands from npm packages.')
    }

    await Promise.all(
      commands.map(async () => {
        const baseLocation = path.join(__dirname, '..', '..')
        const jsonPackageLocation = path.join(baseLocation, 'package.json')
        const JsonPackage = await import(jsonPackageLocation)

        const mineralSettings = JsonPackage['@mineralts']
        if (!mineralSettings) {
          return
        }

        return Promise.all(
          mineralSettings.commands?.map(async (dir: string) => {
            const location = path.join(baseLocation, dir)
            const files = await fs.promises.readdir(location)

            return fetchCommandFiles(files, this.logger, this, this.commands, location)
          })
        )
      })
    )

    function fetchCommandFiles (files, logger, application, commands, location) {
      return Promise.all(
        files.map(async (file: string) => {
          if (file.endsWith('.d.ts')) {
            return
          }

          const { default: Command } = await import(path.join(location, file))
          const command = new Command()

          command.logger = logger
          command.application = application

          commands.set(Command.commandName, command)
        })
      )
    }
  }

  private static getInstance () {
    return this.$instance
  }

  public static create (appRoot: string, environment: any) {
    if (!this.$instance) {
      this.$instance = new Application(appRoot, environment)
    }
    return this.$instance
  }

  public static inProduction () {
    const instance = this.getInstance()
    return instance.mode === 'production'
  }

  public static getClient () {
    const instance = this.getInstance()
    return instance.client
  }

  public static createRequest () {
    const instance = this.getInstance()
    return instance.request
  }

  public static getLogger () {
    const instance = this.getInstance()
    return instance.logger
  }

  public static getContainer () {
    const instance = this.getInstance()
    return instance.container
  }

  public static getToken () {
    const instance = this.getInstance()
    return instance.environment.cache.get('TOKEN')
  }

  public static getEnvironment (): Collection<string, unknown> {
    const instance = this.getInstance()
    return instance.environment.cache
  }

  public static getRcFile (): RcFile {
    const instance = this.getInstance()
    return instance.rcFile
  }

  public static getHelper (): Helper {
    const instance = this.getInstance()
    return instance.helper
  }

  public static registerBinding (key: string, value: unknown) {
    const instance = this.getInstance()
    instance.registerBinding(key, value)
  }

  public static getBinding<T> (key: string): T | undefined {
    const instance = this.getInstance()
    return instance[key]
  }
}