import { InteractionType } from '../../api/types'
import { keyFromEnum } from '../../api/utils'
import CommandInteraction from '../../api/entities/interaction/CommandInteraction'
import Client from '../../api/entities/client'
import GuildMember from '../../api/entities/guild/GuildMember'

export default class CommandInteractionBuilder {
  constructor (private client: Client, private member: GuildMember) {
  }

  public build (payload: any) {
    return new CommandInteraction(
      payload.id,
      payload.version,
      keyFromEnum(InteractionType, payload.type) as any,
      payload.token,
      undefined,
      undefined,
      undefined,
      this.member,
      this.member.guild,
      payload.data
    )
  }
}