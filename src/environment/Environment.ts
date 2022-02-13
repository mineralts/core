/*
 * @mineralts/core.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import fs from 'fs'
import path from 'path'
import YAML from 'js-yaml'
import Collection from '../api/utils/Collection'

export default class Environment {
  public cache: Collection<string, unknown> = new Collection()

  public registerEnvironment (projectDir: string) {
    const environmentContent = fs.readFileSync(path.join(projectDir, 'env.yaml'), 'utf-8')
    const environment = YAML.load(environmentContent) as object

    Object.entries(environment).forEach(([key, value]: [string, unknown]) => {
      this.cache.set(key, value)
    })
  }
}