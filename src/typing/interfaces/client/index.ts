import Collection from '../../../api/utils/Collection'
import { ClientOptions, Snowflake } from '../../../api/types'
import User from '../user'
import Presence from '../presence'
import { MineralEvent } from '../../../core/entities/Event'
import { MineralCommand } from '../../../core/entities/Command'
import GuildManager from '../guild/GuildManager'
import Command from '../../../api/command/Command'

export default interface Client {
  readonly guilds: GuildManager
  readonly container: { events: Collection<string, Map<string, MineralEvent>>, commands: Collection<string, MineralCommand>, subcommands: Collection<string, MineralCommand>}
  readonly token: string
  readonly options: ClientOptions
  readonly user: User
  readonly sessionId: string
  readonly presences: Presence[]
  readonly application: { id: string, flags: number }
  readonly commands: Collection<Snowflake, Command>

  registerGlobalCommands (assembler): Promise<void>
}