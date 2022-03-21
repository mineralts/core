import Packet from '../entities/Packet'
import { CommandType } from '../../api/types'
import Application from '../../application/Application'
import ButtonInteractionBuilder from '../../assembler/builders/ButtonInteractionBuilder'

export default class ButtonInteractionPacket extends Packet {
  public packetType = 'INTERACTION_CREATE'

  public async handle (payload: any) {
    if (payload.type !== CommandType.MESSAGE) {
      return
    }

    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')
    const guild = client.guilds.cache.get(payload.guild_id)

    if (!guild) {
      return
    }

    const member = guild.members.cache.get(payload.member.user.id)
    const buttonInteractionBuilder = new ButtonInteractionBuilder(client, member!)
    const interaction = buttonInteractionBuilder.build(payload)

    emitter.emit('press:button', interaction)
    emitter.emit(`press:button:${interaction.customId}`, interaction)
  }
}