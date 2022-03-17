import Packet from '../entities/Packet'
import { ChannelBuilder } from '../../assembler/builders'
import Application from '../../application/Application'

export default class ThreadUpdatePacket extends Packet {
  public packetType = 'THREAD_UPDATE'

  public async handle (payload: any) {
    const emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')

    const guild = client?.guilds.cache.get(payload.guild_id)
    const before = guild?.channels.cache.get(payload.id)

    const channelBuilder = new ChannelBuilder(client!, guild!)
    const after = channelBuilder.build(payload)

    emitter.emit('update:ThreadChannel', before, after)
    emitter.emit('update:Channel', before, after)

    guild?.channels.cache.set(after.id, after as any)
  }
}