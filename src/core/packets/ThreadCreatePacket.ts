import Packet from '../entities/Packet'
import { ChannelBuilder } from '../../assembler/builders'
import Ioc from '../../Ioc'

export default class ThreadCreatePacket extends Packet {
  public packetType = 'THREAD_CREATE'

  public async handle (payload: any) {
    const emitter = Ioc.singleton().resolve('Mineral/Core/Emitter')
    const client = Ioc.singleton().resolve('Mineral/Core/Client')

    const guild = client?.guilds.cache.get(payload.guild_id)

    const channelBuilder = new ChannelBuilder(client!, guild as any)
    const channel = channelBuilder.build(payload)

    guild?.channels.cache.set(channel.id, channel)

    emitter.emit('create:ThreadChannel', channel)
    emitter.emit('create:channel', channel)
  }
}