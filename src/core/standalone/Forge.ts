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
import Application from '../../application/Application'

class Forge {
  private kernel: Kernel = new Kernel()

  public async handle () {
    this.kernel.disposeKernel()
    await this.kernel.createCliApplication()

    const logger = Application.singleton().resolveBinding('Mineral/Core/Logger')

    const { COMMAND_NAME, ARGS } = process.env

    if (COMMAND_NAME === 'generate:manifest' || COMMAND_NAME === 'help' || !COMMAND_NAME) {
      const commands = Application.singleton().resolveBinding('Mineral/Core/Cli')
      const command = commands.resolveCommand(COMMAND_NAME || 'help')
      await command.run()
    } else {
      const forgeManifest = await import(path.join(process.cwd(), 'forge-manifest.json'))
      const forgeCommand = forgeManifest.commands.find((command: { commandName: string }) => (
        command.commandName === COMMAND_NAME
      ))

      if (!forgeCommand) {
        logger.error('Command not found.')
        return
      }

      const location = forgeCommand.path.startsWith('/')
        ? path.join(process.cwd(), forgeCommand.path)
        : path.join(process.cwd(), 'node_modules', forgeCommand.path)

      const { default: Command } = await import(location)
      const command = new Command()

      command.logger = logger
      command.application = this.kernel.application

      await command.run(...ARGS?.split(' ') || [])
    }
  }
}

new Forge().handle()