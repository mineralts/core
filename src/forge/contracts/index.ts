/*
 * (c) Pointurier Thibault
 *
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 */

import { PackageJson, template } from 'mrm-core'

export type TemplateNode =
  | {
  src: string,
  dest: string,
  data?: any,
  mustache?: boolean
    }
  | string

export type PackageInstructionsBlock = {
  instructions?: string,
  instructionsMd?: string,
  templates?: {
    basePath?: string
  } & {
    [templateFor: string]: TemplateNode | TemplateNode[]
  }
}

export type PackageFile = PackageJson & {
  mineralts: PackageInstructionsBlock
}
