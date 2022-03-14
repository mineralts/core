import Collection from '../../api/utils/Collection'
import fs from 'fs'
import { BuildOption, RcFile } from '../types'
import { Intent } from '../../application/types'
import { join } from 'node:path'
import { parse } from 'dotenv'

interface Environment {
  APP_NAME: string,
  APP_VERSION: string
  APP_ROOT: string
  APP_DEBUG: boolean
  APP_MODE: 'production' | 'testing' | 'development'
  TOKEN: string
  REFLECT: boolean
  RC_FILE: RcFile
  MINERAL_DEPENDENCIES: { [K: string]: unknown }[]
  BUILD?: BuildOption,
  INTENTS: {
    selected: 'ALL' | Exclude<keyof typeof Intent, 'ALL'>[]
    bitfield: number
  }
}

type EnvironmentType<T> = T extends keyof Environment ? Environment[T] : any

export default class MineralEnvironmentService {
  public collection: Collection<keyof Environment | string, unknown> = new Collection()

  public registerKey<T extends keyof Environment | string> (key: T, value: EnvironmentType<T>): void {
    this.collection.set(key, value)
  }

  public resolveKey<T extends keyof Environment | string> (key: T): EnvironmentType<T> | undefined {
    return this.collection.get(key)
  }

  public resolveEnvironment () {
    const root = this.resolveKey('APP_ROOT')!

    const environmentContent = fs.readFileSync(join(root, '.env'), 'utf-8')
    const environment = parse(environmentContent)


    Object.entries(environment).forEach(([key, value]: [string, any]) => {
      process.env[key] = value
      this.registerKey(key, value)
    })
  }

  public loadFileSync (location: string, filename: string, message?: string) {
    try {
      return JSON.parse(fs.readFileSync(join(location, filename), 'utf-8'))
    } catch (error) {
      throw new Error(
        message || `The file ${filename} at location ${location} was not found.`
      )
    }
  }
}