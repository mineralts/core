import Collection from '../../utils/Collection'
import { ClientOptions, Snowflake } from '../../types'
import User from '../user'
import Presence from '../presence'
import Command from '../../command/Command'
import Application from '../../../application/Application'
import { serializeCommand } from '../../utils'
import GuildManager from '../guild/GuildManager'
import DmManager from '../private/DmManager'

export default class Client {
  public guilds: GuildManager = new GuildManager()
  public privates: DmManager = new DmManager()

  constructor (
    public container: any,
    public token: string,
    public options: ClientOptions,
    public user: User,
    public sessionId: string,
    public presences: Presence[],
    public application: { id: string, flags: number },
    public commands: Collection<Snowflake, Command> = new Collection(),
  ) {
  }
  
  public async registerGlobalCommands (assembler) {
    const request = Application.createRequest()
    const commandContainer = assembler.application.container.commands
    const commands = commandContainer.filter((command) => (
      command.data.scope == 'GLOBAL'
    ))

    await Promise.all(
      commands.map(async (command) => {
        await request.post(`/applications/${this.application.id}/commands`, {
          ...serializeCommand(command.data)
        })
      })
    )
  }
}