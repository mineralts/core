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

export default class Ignitor {
  private logger: Logger = new Logger

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

    if (command.settings?.loadApp) {
      await this.execTypescript(commandName, ...args)
    } else {
      await this.execJavascript(commandName, ...args)
    }
  }

  protected async execTypescript (commandName: string, ...args: string[]) {
    const forgeFile = path.join('node_modules', '@mineralts', 'core-preview', 'build', 'core', 'standalone', 'Forge.js')
    const stringArgs = args.slice(1).join(' ')

    const esbuild = path.join(process.cwd(), 'node_modules', 'esbuild-dev', 'pkg', 'esbuild-dev.bin.js')
    const command = `node ${esbuild} ${forgeFile} ${stringArgs}`

    execSync(command, {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: {
        COMMAND_NAME: commandName,
        ARGS: stringArgs,
        NODE_ENV: 'development'
      }
    })

    process.exit(0)
  }

  private async execJavascript (commandName: string, ...args: string[]) {
    process.env.NODE_ENV = 'development'
    const kernel = new Kernel()
    const cli = kernel.application.ioc.resolveBinding('Mineral/Core/Cli')
    await cli?.register()

    const command = cli?.resolveCommand(commandName)

    if (!command) {
      this.logger.error('Command not found.')
      return
    }

    await command.run(...args)
  }
}