/*
 * @mineralts/standalone-preview/MakeCommand.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { ForgeCommand } from '../forge/entities/Command'
import { join } from 'node:path'
import { ChildProcess, exec } from 'child_process'
import { TypescriptCompiler } from '@poppinss/chokidar-ts'
import { getWatcherHelpers } from '@adonisjs/require-ts'

export default class ApplicationDev extends ForgeCommand {
  public static commandName = 'dev'
  public static description = 'Starting the application in development mode'

  public child: ChildProcess | undefined

  public static settings = {
    typescript: true
  }

  public async run (): Promise<void> {
    const console = this.ioc.resolve('Mineral/Core/Console')
    const watcherHelper = getWatcherHelpers(process.cwd())

    const compiler = new TypescriptCompiler(
      process.cwd(),
      'tsconfig.json',
      await import('typescript/lib/typescript')
    )

    const { config } = compiler.configParser().parse()
    const watcher = compiler.watcher(config!, 'raw')

    watcher.on('watcher:ready', () => {
      console.logger.info('watching file system for changes')
      this.start()
    })

    watcher.on('source:add', async ({ absPath, relativePath }) => {
      watcherHelper.clear(absPath)
      console.logger.action('create').succeeded(relativePath)

      this.restart()
    })

    watcher.on('source:change', async ({ absPath, relativePath }) => {
      watcherHelper.clear(absPath)
      console.logger.action('update').succeeded(relativePath)

      this.restart()
    })

    watcher.on('source:unlink', async ({ absPath, relativePath }) => {
      watcherHelper.clear(absPath)
      console.logger.action('delete').succeeded(relativePath)

      this.restart()
    })


    watcher.watch(['.'], {
      ignored: ['node_modules', 'build'],
    })
  }

  protected start () {
    const esbuild = join(__dirname, '..', '..', 'node_modules', '@adonisjs', 'require-ts', 'build', 'register')
    this.child = exec(`node -r ${esbuild} index.ts --colors`, {
      cwd: process.cwd(),
      env: {
        NODE_ENV: 'development',
        FORCE_COLOR: '1'
      }
    })

    this.child.stdout?.pipe(process.stdout)
    this.child.stderr?.pipe(process.stderr)

    process.on('SIGINT', this.exit)
    process.on('SIGTERM', this.exit)
  }

  protected restart () {
    this.child?.kill()
    this.start()
  }

  protected exit () {
    process.exit()
  }
}