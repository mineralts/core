import Logger from '@mineralts/logger'
import Entity from './Entity'
import Application from '../../application/Application'

export function Provider () {
  return (target: any) => {
    target.identifier = 'provider'
  }
}

export abstract class MineralProvider {
  public logger: Logger
  public application: Application

  abstract boot (...args: any[]): Promise<void>
  abstract loadFile (entity: Entity): Promise<void>
  abstract ok (): Promise<void>
}