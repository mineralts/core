/*
 * @mineralts/standalone-preview/MakeCommand.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { Command } from '../forge/entities/Command'
import { build } from 'esbuild'
import fs from 'node:fs'
import { join } from 'node:path'
import Application from '../application/Application'
import production from '../extract/presets/production'

export default class ApplicationProd extends Command {
  public static commandName = 'app:build'
  public static description = 'Starting the application in development mode'

  public static settings = {
    loadApp: true
  }

  public async run (): Promise<void> {
    const environment = Application.singleton().resolveBinding('Mineral/Core/Environment')
    const buildOptions = environment.resolveKey('build')

    const buildLocation = join(process.cwd(), buildOptions?.OUT_DIR || 'build')
    const preset = await production()

    await build(preset)

    await Promise.all([
      this.copyToBuild(buildLocation, 'env.yaml'),
      this.copyToBuild(buildLocation, 'package.json'),
      this.copyToBuild(buildLocation, '.mineralrc.json')
    ])
  }

  protected copyToBuild (destination: string, file: string) {
    return fs.promises.copyFile(join(process.cwd(), file), join(destination, file))
  }
}