/*
 * packages/index.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import Kernel from './core/Kernel'
import { MineralCommand, MineralSubcommand, Subcommand, Command, Option } from './core/entities/Command'
import { MineralEvent, Event } from './core/entities/Event'
import { MineralProvider, Provider } from './core/entities/Provider'
import Ignitor from './core/standalone/Ignitor'
import MessageEmbed from './api/entities/embed/MessageEmbed'

export * from './typing/interfaces'

export {
  Kernel,
  MineralCommand,
  MineralSubcommand,
  Command,
  Subcommand,
  Option,
  MineralEvent,
  Event,
  Provider,
  MineralProvider,
  Ignitor,
  MessageEmbed
}