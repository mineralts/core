import Packet from '../entities/Packet'
import { CommandType, InteractionType } from '../../api/types'
import MenuInteractionBuilder from '../../assembler/builders/MenuInteractionBuilder'
import Ioc from '../../Ioc'

export default class MenuInteractionPacket extends Packet {
  public packetType = 'INTERACTION_CREATE'

  public async handle (payload: any): Promise<void> {
    if (payload.type !== InteractionType.APPLICATION_COMMAND || payload.data.type === CommandType.CHAT_INPUT) {
      return
    }

    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')
    const menus = Ioc.singleton().resolve('Mineral/Core/ContextMenus')

    const guild = client.guilds.cache.get(payload.guild_id)
    if (!guild) {
      return
    }

    const member = guild.members.cache.get(payload.member.user.id)
    if (!member) {
      return
    }

    const interactionBuilder = new MenuInteractionBuilder(client, member!)
    const interaction = interactionBuilder.build(payload)

    const menu = menus.collection.get(interaction.params.name)

    if (!menu) {
      return
    }

    await menu.run(interaction as any)

    emitter.emit('action:context', interaction)
  }
}