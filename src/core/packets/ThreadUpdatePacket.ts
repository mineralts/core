import Packet from '../entities/Packet'
import { ChannelBuilder } from '../../assembler/builders'
import Ioc from '../../Ioc'

export default class ThreadUpdatePacket extends Packet {
  public packetType = 'THREAD_UPDATE'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild = client?.guilds.cache.get(payload.guild_id)
    const before = guild?.channels.cache.get(payload.id)

    const channelBuilder = new ChannelBuilder(client!, guild!)
    const after = channelBuilder.build(payload)

    emitter.emit('update:ThreadChannel', before, after)
    emitter.emit('update:Channel', before, after)

    guild?.channels.cache.set(after.id, after as any)
  }
}