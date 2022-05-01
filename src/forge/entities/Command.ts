/*
 * packages/Command.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import Console from '@poppinss/cliui'
import Index from '../../Ioc'
import Prompt from '../actions/Prompt'

export abstract class ForgeCommand {
  public console: typeof Console
  public ioc: Index
  public prompt: Prompt
  public static settings: { loadApp?: boolean, typescript?: boolean } = { loadApp: false, typescript: false }
  public abstract run (...args: string[]): Promise<void>
}