import Packet from '../entities/Packet'
import { CommandInteractionBuilder } from '../../assembler/builders'
import { CommandType, OptionType } from '../../api/types'
import { MineralBaseCommand } from '../entities/Command'
import CommandInteraction from '../../api/entities/interaction/CommandInteraction'
import Ioc from '../../Ioc'

export default class CommandInteractionPacket extends Packet {
  public packetType = 'INTERACTION_CREATE'

  public async handle (payload: any) {
    if (payload.data.type !== CommandType.CHAT_INPUT) {
      return
    }

    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')
    const commands = Ioc.singleton().resolve('Mineral/Core/Commands')
    const console = Ioc.singleton().resolve('Mineral/Core/Console')

    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const member = guild.members.cache.get(payload.member.user.id)

    const interactionBuilder = new CommandInteractionBuilder(client, member!)
    let interaction: CommandInteraction

    const command = commands.collection.find((command: MineralBaseCommand) => (
      command.data.label === payload.data.name
    ))

    if (!command) {
      return
    }

    if (!payload.data.options) {
      payload.data.options = []
    }

    const subcommand = payload.data.options.find((option) => (
      option.type === OptionType.SUB_COMMAND
    ))

    if (subcommand) {
      interaction = interactionBuilder.build({
        ...payload,
        data: subcommand.options
      })

      await command[subcommand.name](interaction)
    } else {
      interaction = interactionBuilder.build({
        ...payload,
        data: payload.data.options
      })

      if (!command['run']) {
        console.logger.fatal(new Error('The "run" method does not exist within your command.'))
        return
      }

      await command['run'](interaction)
    }

    emitter.emit('use:command', interaction)
    emitter.emit(`use:command:${interaction.customId}`, interaction)
  }
}