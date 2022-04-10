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
import { execSync } from 'child_process'

export default class ApplicationDev extends ForgeCommand {
  public static commandName = 'app:dev'
  public static description = 'Starting the application in development mode'

  public static settings = {
    loadApp: true
  }

  public async run (): Promise<void> {
    const esbuild = join(__dirname, '..', '..', 'node_modules', '@adonisjs', 'require-ts', 'build', 'register')
    execSync(`node -r ${esbuild} index.ts`, {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: {
        NODE_ENV: 'development'
      }
    })

    // const esbuild = path.join(process.cwd(), 'node_modules', 'esbuild-dev', 'pkg', 'esbuild-dev.bin.js')
    //
    // execSync(`node ${esbuild} start/index.ts --watch --supervise`, {
    //   cwd: process.cwd(),
    //   stdio: 'inherit',
    //   env: {
    //     NODE_ENV: 'development'
    //   }
    // })
    // process.exit()
  }
}