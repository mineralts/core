/*
 * packages/Forge.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import Kernel from '../Kernel'
import path from 'path'
import Ioc from '../../Ioc'
import { ForgeCommand } from '../../forge/entities/Command'
import Prompt from '../../forge/actions/Prompt'

class Forge {
  private kernel: Kernel = new Kernel()

  public async handle () {
    const { COMMAND_NAME, LOAD_APP, ARGS } = process.env
    const console = Ioc.singleton().resolve('Mineral/Core/Console')
    const cli = await this.kernel.createCliApplication(Boolean(LOAD_APP))


    if (COMMAND_NAME === 'generate:manifest' || COMMAND_NAME === 'help' || !COMMAND_NAME) {
      const command = cli.resolveCommand(COMMAND_NAME || 'help')
      await command.run()
      return
    }

    const forgeManifest = await import(path.join(process.cwd(), 'forge-manifest.json'))
    const forgeCommand = forgeManifest.commands.find((command: { commandName: string }) => (
      command.commandName === COMMAND_NAME
    ))

    if (!forgeCommand) {
      console.logger.error('Command not found.')
      return
    }

    const location = forgeCommand.path.startsWith('/')
      ? path.join(process.cwd(), forgeCommand.path)
      : path.join(process.cwd(), 'node_modules', forgeCommand.path)

    const { default: Command } = await import(location)
    const command = new Command() as ForgeCommand

    command.ioc = Ioc.singleton()
    command.prompt = new Prompt()

    try {
      const args: string[] = ARGS?.split(' ') || []
      await command.run(...args)
    } catch {
      console.logger.error('Order has been cancelled.')
    }
  }
}

new Forge().handle()