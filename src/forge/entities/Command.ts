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
import Application from '../../application/Application'

export abstract class Command {
  public logger!: Logger
  public application!: Application
  public static settings: { loadApp: boolean } = { loadApp: false }
  public abstract run (...args: string[]): Promise<void>
}