import Packet from '../entities/Packet'
import { CommandType } from '../../api/types'
import Ioc from '../../Ioc'
import SelectMenuInteractionBuilder from '../../assembler/builders/SelectMenuInteractionBuilder'

export default class SelectMenuInteractionPacket extends Packet {
  public packetType = 'INTERACTION_CREATE'

  public async handle (payload: any) {
    if (payload.type !== CommandType.MESSAGE) {
      return
    }

    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')
    const guild = client.guilds.cache.get(payload.guild_id)

    if (!guild) {
      return
    }

    const member = guild.members.cache.get(payload.member.user.id)
    const selectMenuBuilder = new SelectMenuInteractionBuilder(client, member!)
    const interaction = selectMenuBuilder.build(payload)

    emitter.emit('select:menu', interaction)
    emitter.emit(`select:menu::${interaction.customId}`, interaction)
  }
}
