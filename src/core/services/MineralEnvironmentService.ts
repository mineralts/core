import Collection from '../../api/utils/Collection'
import fs from 'fs'
import { BuildOption, RcFile } from '../types'
import { Intent } from '../../application/types'
import { join } from 'node:path'
import { parse } from 'dotenv'
import { Exception } from '@poppinss/utils'
import Ioc from '../../Ioc'

type Schema = { [K: string]: unknown }

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
  },
  CDN: string
  DISCORD_VERSION: string
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

  public rules<T extends Schema> (rules: T) {
    return rules
  }

  public schema = {
    number: () => 'number',
    string: () => 'string',
    boolean: () => 'boolean'
  }

  public async validateSchema () {
    const environment = Ioc.singleton().resolve('Mineral/Core/Environment')

    const { default: validator } = await import(join(process.cwd(), 'env.ts'))
    Object.entries(validator).forEach(([key, type]: [string, any]) => {
      const value = environment.resolveKey(key)
      if (!value) {
        console.log('error', key)
        return
      }

      const schema = {
        number: () => this.wrapProcess(key, 'number', type === 'number' && !isNaN(value)),
        string: () => this.wrapProcess(key, 'string', type === 'string' && typeof value === 'string' && (value !== 'true' && value !== 'false')),
        boolean: () => this.wrapProcess(key, 'boolean', [true, false].includes(JSON.parse(value)))
      }

      if (type in schema) {
        schema[type]()
      }
    })
  }

  protected wrapProcess (key: string, type, test: boolean) {
    if (!test) {
      throw new Exception(
        `Value for environment variable "${key}" must be ${type}`,
        500,
        'INVALID_ENV_KEY'
      )
    }
  }
}
