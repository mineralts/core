import Console from '@poppinss/cliui'
import Entity from './Entity'
import Container from '../../application/Container'

export function Provider () {
  return (target: any) => {
    target.identifier = 'provider'
  }
}

export abstract class MineralProvider {
  public console: typeof Console
  public application: Container

  abstract boot (...args: any[]): Promise<void>
  abstract loadFile (entity: Entity): Promise<void>
  abstract ok (): Promise<void>
}