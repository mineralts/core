/*
 * packages/Ignitor.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { execSync } from 'child_process'
import path from 'path'
import Kernel from '../Kernel'
import Logger from '@mineralts/logger'
import Environment from '../../environment/Environment'

export default class Ignitor {
  private logger: Logger = new Logger
  private environment: Environment = new Environment()

  public async forge () {
    const [commandName, ...args] = process.argv.slice(2)

    if (commandName === 'generate:manifest' || commandName === 'help' || !commandName) {
      await this.execTypescript(commandName || 'help', ...args)
    }

    let command

    try {
      const manifest = await import(path.join(process.cwd(), 'forge-manifest.json'))
      command = manifest.commands.find((command) => command.commandName === commandName)
    } catch (err) {
      this.logger.fatal('The manifest file was not found, please generate it before running a command.')
      process.exit(1)
    }

    if (!command) {
      this.logger.error('Command not found.')
      return
    }

    this.environment.registerEnvironment()
    if (command.settings?.loadApp) {
      await this.execTypescript(commandName, ...args)
    } else {
      await this.execJavascript(commandName, ...args)
    }
  }

  private async execTypescript (commandName: string, ...args: string[]) {
    const forgeFile = path.join('node_modules', '@mineralts', 'core-preview', 'build', 'core', 'standalone', 'Forge.js')
    const stringArgs = args.slice(1).join(' ')

    const esbuild = path.join(process.cwd(), 'node_modules', 'esbuild-dev', 'pkg', 'esbuild-dev.bin.js')
    const command = `node ${esbuild} ${forgeFile} ${stringArgs}`

    execSync(command, {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: {
        TOKEN: this.environment.cache.get<string>('TOKEN'),
        COMMAND_NAME: commandName,
        ARGS: stringArgs
      }
    })

    process.exit()
  }

  private async execJavascript (commandName: string, ...args: string[]) {
    const token = this.environment.cache.get<string>('TOKEN')

    if (!token) {
      this.logger.fatal('Token was not provided')
      process.exit(1)
    }

    const kernel = new Kernel()
    await kernel.application.registerCliCommands()

    const command = kernel.application.commands.get(commandName)

    if (!command) {
      this.logger.error('Command not found.')
      return
    }

    await command.run(...args)
  }
}