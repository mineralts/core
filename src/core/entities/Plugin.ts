import Container from '../../application/Container'
import Logger from '@mineralts/logger'

export abstract class MineralPlugin {
  abstract configure (): Promise<void>
  logger: Logger
  ioc: Container
}