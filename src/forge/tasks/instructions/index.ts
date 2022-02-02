/*
 * (c) Pointurier Thibault
 *
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 */

import { ApplicationContract } from '../../../application/types'
import { resolveFrom } from '@poppinss/utils/build/helpers'
import { PackageFile, PackageInstructionsBlock } from '../../contracts'

export class Instructions {

  private packagePath : string = this.getPackagePath()
  private markdownDisplay: 'browser' | 'terminal' | undefined = undefined

  constructor(
    private packageName: string,
    private projectRoot: string,
    private application:  ApplicationContract,
    private verbose = false
  ) {
  }

  /**
   * Returns the absolute path to the package
   */
  private getPackagePath() {
    try {
      return resolveFrom(this.projectRoot, `${this.packageName}/package.json`)
    } catch (error: any) {
      if (['MODULE_NOT_FOUND', 'ENOENT'].includes(error.code)) {
        throw new Error(`Cannot invoke instruction. Missing package "${this.packageName}"`)
      }
      throw error
    }
  }

  /**
   * Load package json file from the package root directory
   */
  private loadPackageJsonFile(): PackageFile {
    return require(this.packagePath)
  }

  /**
   * copie templates to the user priject
   */
  private copyTemplates(instructions: PackageInstructionsBlock) {
    if (!instructions.templates) {
      return
    }

    const templateSourceDir = instructions.templates.basePath || './build/templates'
  }

}

