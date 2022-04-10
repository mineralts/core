/*
 * packages/GenerateManifest.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import path from 'node:path'
import { existsSync } from 'node:fs'
import { ForgeCommand } from '../forge/entities/Command'

export default class Help extends ForgeCommand {
  public static commandName = 'help'
  public static description = 'Generate manifest file'

  public static settings = {
    loadApp: true
  }

  public async run (): Promise<void> {
    console.info()
    const location = path.join(process.cwd(), 'forge-manifest.json')

    if (!existsSync(location)) {
      const commands = this.ioc.resolve('Mineral/Core/Cli')
      const command = commands.resolveCommand('generate:manifest')

      await command?.run(false)
    }

    const manifest = await import(location)
    const maxWidth = Math.max.apply(Math, [...manifest.commands.map((command) => command.commandName.length)])
    const sortedCommands = this.sortAndGroupCommands(manifest.commands)

    sortedCommands
      .forEach((container) => {
        if (container.group === 'root') {
          console.log('\x1B[34mAvailable commands\x1B[0m')
        } else {
          console.log(`\n\x1B[34m${container.group}\x1B[0m`)
        }

        container.commands.forEach(({ commandName, description }) => {
          const whiteSpace = ''.padEnd(maxWidth - commandName.length, ' ')

          console.log(
            `  ${this.console.logger.colors.cyan(commandName)} ${whiteSpace}  ${this.console.logger.colors.dim(description)}`
          )
        })
      })
    console.info()
  }

  private sortAndGroupCommands(commands) {
    const groupsLiteral = commands.reduce((result, command) => {
      const tokens = command.commandName.split(':')

      const group = tokens.length > 1 ? tokens.shift()! : 'root'

      result[group] = result[group] || []
      result[group].push(command)

      return result
    }, {} as { [key: string]: any[] })

    return Object.keys(groupsLiteral)
      .sort((prev, curr) => {
        if (prev === 'root') return -1
        if (curr === 'root') return 1
        if (curr > prev) return -1
        if (curr < prev) return 1
        return 0
      })
      .map((name) => ({
        group: name,
        commands: groupsLiteral[name].sort((prev, curr) => {
          if (curr.commandName > prev.commandName) return -1
          if (curr.commandName < prev.commandName) return 1
          return 0
        }),
      }))
  }
}