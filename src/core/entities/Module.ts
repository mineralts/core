import Container from '../../application/Container'
import Console from '@poppinss/cliui'
import Prompt from '../../forge/actions/Prompt'

export abstract class MineralModule {
  abstract configure (): Promise<void>
  console: typeof Console
  ioc: Container
  prompt: Prompt
}