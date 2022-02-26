import Assembler from '../../assembler/Assembler'
import Packet from '../entities/Packet'
import { CommandInteractionBuilder } from '../../assembler/builders'
import { OptionType } from '../../api/types'
import { MineralBaseCommand } from '../entities/Command'
import { CommandType } from '../../api/types'
import CommandInteraction from '../../api/entities/interaction/CommandInteraction'

export default class CommandInteractionPacket extends Packet {
  public packetType = 'INTERACTION_CREATE'

  public async handle (assembler: Assembler, payload: any) {
    if (payload.data.type !== CommandType.CHAT_INPUT) {
      return
    }

    const client = assembler.application.client
    const container = assembler.application.container

    const guild = client.guilds.cache.get(payload.guild_id)
    const member = guild?.members.cache.get(payload.member.user.id)

    const interactionBuilder = new CommandInteractionBuilder(assembler.application.client as any, member as any)
    let interaction: CommandInteraction

    const command = container.commands.find((command: MineralBaseCommand) => (
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
        assembler.application.logger.fatal('The "run" method does not exist within your command.')
        return
      }

      await command['run'](interaction)
    }

    assembler.eventListener.emit('commandInteraction', interaction)
  }
}