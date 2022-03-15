import Container from '../../application/Container'
import Logger from '@mineralts/logger'
import Prompt from '../../forge/actions/Prompt'

export abstract class MineralModule {
  abstract configure (): Promise<void>
  logger: Logger
  ioc: Container
  prompt: Prompt
}