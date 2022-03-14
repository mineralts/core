/*
 * packages/Command.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import Logger from '@mineralts/logger'
import Container from '../../application/Container'

export abstract class ForgeCommand {
  public logger: Logger
  public ioc: Container
  public static settings: { loadApp: boolean } = { loadApp: false }
  public abstract run (...args: string[]): Promise<void>
}