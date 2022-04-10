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
import { build, BuildOptions } from 'esbuild'
import fs from 'node:fs'
import { join } from 'node:path'
import Application from '../application/Application'
import production from '../extract/presets/production'

export default class ApplicationProd extends ForgeCommand {
  public static commandName = 'build'
  public static description = 'Builds and optimises the application for production'

  public static settings = {
    loadApp: true
  }

  public async run (): Promise<void> {
    const environment = Application.singleton().resolveBinding('Mineral/Core/Environment')
    const buildOptions = environment.resolveKey('BUILD')

    const buildLocation = join(process.cwd(), buildOptions?.OUT_DIR || 'build')
    const preset = await production()

    await build(preset as BuildOptions)

    await Promise.all([
      this.copyToBuild(buildLocation, '.env'),
      this.copyToBuild(buildLocation, 'package.json'),
      this.copyToBuild(buildLocation, '.mineralrc.json')
    ])
  }

  protected copyToBuild (destination: string, file: string) {
    return fs.promises.copyFile(join(process.cwd(), file), join(destination, file))
  }
}