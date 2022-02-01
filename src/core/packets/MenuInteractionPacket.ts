import Packet from '../entities/Packet'
import Assembler from '../../assembler/Assembler'
import { CommandType } from '../../api/types'
import MenuInteractionBuilder from '../../assembler/builders/MenuInteractionBuilder'

export default class MenuInteractionPacket extends Packet {
  public packetType = 'INTERACTION_CREATE'

  public async handle (assembler: Assembler, payload: any): Promise<void> {
    if (payload.type === CommandType.CHAT_INPUT) {
      return
    }

    const client = assembler.application.client
    const container = assembler.application.container

    const guild = client.guilds.cache.get(payload.guild_id)
    const member = guild?.members.cache.get(payload.member.user.id)

    const interactionBuilder = new MenuInteractionBuilder(assembler.application.client, member!)
    const interaction = interactionBuilder.build(payload)

    const menu = container.menus.get(interaction.params.name)

    if (!menu) {
      return
    }

    await menu.run(interaction as any)

    assembler.eventListener.emit('menuInteraction', interaction)
  }
}