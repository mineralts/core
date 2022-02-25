import { DateTime } from 'luxon'
import Packet from '../entities/Packet'
import Assembler from '../../assembler/Assembler'
import { Client, User } from '../../api/entities'
import Collection from '../../api/utils/Collection'
import UserFlags from '../../api/entities/user/UserFlags'
import { FlagIdentifier, FlagLabel } from '../../api/types'

export default class ReadyPacket extends Packet {
  public packetType = 'READY'

  public async handle (assembler: Assembler, payload: any) {
    console.log(payload)
    const flag = new UserFlags(
      FlagIdentifier[payload.user.public_flags || 0],
      FlagLabel[payload.user.public_flags || 0],
      payload.user.public_flags ||0
    )

    const user = new User(
      payload.user.id,
      payload.user.username,
      payload.user.discriminator,
      `${payload.user.username}#${payload.user.discriminator}`,
      payload.user.bot,
      DateTime.fromISO(payload.user.premium_since),
      payload.user.verified,
      payload.user.mfa_enabled,
      flag,
      payload.user.email,
      payload.user.avatar,
      payload.user.banner,
      undefined
    )

    const token = assembler.application.environment.cache.get('TOKEN') as string
    const client = new Client(
      assembler.application.container,
      token,
      {},
      user,
      payload.session_id,
      payload.presences,
      payload.application,
      new Collection()
    )

    assembler.application.client = client as any

    await assembler.register()
    await client.registerGlobalCommands(assembler)

    assembler.eventListener.emit('ready', client)
  }
}