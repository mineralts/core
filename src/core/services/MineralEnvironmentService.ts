import Collection from '../../api/utils/Collection'
import fs from 'fs'
import path from 'path'
import YAML from 'js-yaml'
import { RcFile } from '../types'
import { Intent } from '../../application/types'

interface Environment {
  appName: string,
  appVersion: string
  root: string
  debug: boolean
  reflect: boolean
  rcFile: RcFile
  mode: 'production' | 'testing' | 'development'
  intents: {
    selected: 'ALL' | Exclude<keyof typeof Intent, 'ALL'>[]
    bitfield: number
  }
}

type EnvironmentType<T> = T extends keyof Environment ? Environment[T] : any

export class MineralEnvironmentService {
  public collection: Collection<keyof Environment | string, unknown> = new Collection()

  public registerKey<T extends keyof Environment | string> (key: T | string, value: EnvironmentType<T>): void {
    this.collection.set(key, value)
  }

  public resolveKey<T extends keyof Environment | string> (key: T | string): EnvironmentType<T> | undefined {
    return this.collection.get(key)
  }

  public resolveEnvironment () {
    const root = this.resolveKey<string>('root')!

    const environmentContent = fs.readFileSync(path.join(root, 'env.yaml'), 'utf-8')
    const environment = YAML.load(environmentContent) as object

    Object.entries(environment).forEach(([key, value]: [string, unknown]) => {
      this.registerKey(key, value)
    })
  }
}