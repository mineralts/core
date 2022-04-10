import Index from '../../Ioc'
import Console from '@poppinss/cliui'
import Prompt from '../../forge/actions/Prompt'

export abstract class MineralModule {
  abstract configure (): Promise<void>
  console: typeof Console
  ioc: Index
  prompt: Prompt
}