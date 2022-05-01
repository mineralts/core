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
import { logger as Logger } from '@poppinss/cliui'
import Ioc from '../../Ioc'

export default class Ignitor {
  private logger: typeof Logger = Logger

  public async forge () {
    const [commandName, ...args] = process.argv.slice(2)

    if (commandName === 'generate:manifest' || commandName === 'help' || !commandName) {
      await this.execTypescript(commandName || 'help', true, ...args)
      return
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

    if (command.settings?.typescript && command.settings?.loadApp) {
      await this.execTypescript(commandName, command.settings?.loadApp, ...args)
    } else {
      await this.execJavascript(commandName, command.settings?.loadApp, ...args)
    }
  }

  protected async execTypescript (commandName: string, loadApp: boolean, ...args: string[]) {
    const forgeFile = path.join('node_modules', '@mineralts', 'core-preview', 'build', 'core', 'standalone', 'Forge.js')
    const tsnode = path.join('node_modules', 'ts-node', 'dist', 'bin-transpile.js')

    execSync(`node ${tsnode} ${forgeFile}`, {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: {
        COMMAND_NAME: commandName,
        LOAD_APP: loadApp.toString(),
        ARGS: args.join(' '),
        NODE_ENV: 'forge'
      }
    })
    process.exit()
  }

  private async execJavascript (commandName: string, loadApp, ...args: string[]) {
    process.env.NODE_ENV = 'forge'
    const kernel = new Kernel()
    await kernel.createCliApplication(loadApp)

    const cli = Ioc.singleton().resolve('Mineral/Core/Cli')
    const command = cli?.resolveCommand(commandName)

    if (!command) {
      this.logger.error('Command not found.')
      return
    }

    try {
      await command.run(...args)
    } catch {
      this.logger.error('Order has been cancelled.')
    }
  }
}