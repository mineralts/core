import Collection from '../../api/utils/Collection'
import fs from 'fs'
import path from 'path'
import YAML from 'js-yaml'
import { RcFile } from '../types'
import { Intent } from '../../application/types'
import Application from '../../application/Application'

interface Environment {
  appName: string,
  appVersion: string
  token: string
  root: string
  debug: boolean
  reflect: boolean
  rcFile: RcFile
  mode: 'production' | 'testing' | 'development'
  mineralDependencies: { [K: string]: unknown }[]
  intents: {
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
    const helpers = Application.singleton().resolveBinding('Mineral/Core/Helpers')
    const root = this.resolveKey('root')!

    const environmentContent = fs.readFileSync(path.join(root, 'env.yaml'), 'utf-8')
    const environment = YAML.load(environmentContent) as object

    Object.entries(environment).forEach(([key, value]: [string, unknown]) => {
      this.registerKey(helpers.camelCase(key), value)
    })
  }
}