/*
 * packages/Entity.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { MineralCommand } from './Command'
import { MineralEvent } from './Event'

export default class Entity {
  constructor (
    public readonly source: MineralCommand | MineralEvent,
    public path: string,
  ) {
  }
}