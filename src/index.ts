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
import { MineralTask, Task } from './core/entities/tasks/Task'
import Ignitor from './core/standalone/Ignitor'
import MessageEmbed from './api/entities/embed/MessageEmbed'
import Scheduler from './core/entities/tasks/Scheduler'

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
  MineralTask,
  Task,
  Provider,
  MineralProvider,
  Ignitor,
  MessageEmbed,
  Scheduler
}