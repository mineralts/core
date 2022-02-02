/*
 * (c) Pointurier Thibault
 *
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 */

import { extname, isAbsolute } from 'path'
import { ApplicationContract } from '../../../application/types'
import { TemplateNode } from '../../contracts'

export class Templates {

  constructor(
    private projectRoot: string,
    private templatesSourceDir: string,
    private application: ApplicationContract
  ) {
    if (!isAbsolute(this.projectRoot)) {
      throw new Error('Templates manager needs an absolute path to the project root')

    }

    if (!isAbsolute(this.templatesSourceDir)) {
      throw new Error('Templates manager needs an absolute path to the templates source directory')
    }
  }

  private normalizeTemplateNode(template: TemplateNode): Exclude<TemplateNode, string> {
    template =
      typeof template === 'string'
        ? {
          src: template,
          dest: template.replace(new RegExp(`${extname(template)}&`), ''),
          mustache: false,
          data: {}
        }
        : template

    template.dest = extname(template.dest) === '' ? `${template.dest}.ts` : template.dest
    return template
  }
}
