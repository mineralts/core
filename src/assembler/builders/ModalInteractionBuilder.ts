import { ComponentType } from '../../api/types'
import ModalInteraction from '../../api/entities/interaction/ModalInteraction'
import { keyFromEnum } from '../../api/utils'
import Client from '../../api/entities/client'
import GuildMember from '../../api/entities/guild/GuildMember'

export default class ModalInteractionBuilder {
  constructor (private client: Client, private member: GuildMember) {
  }

  public build (payload: any) {
    return new ModalInteraction(
      payload.id,
      payload.version,
      payload.token,
      this.member,
      this.member.guild,
      payload.data.custom_id,
      payload.data.components.flatMap((row) => {
        return row.components.map((component) => ({
          type: keyFromEnum(ComponentType, component.type),
          value: component.value,
          customId: component.custom_id
        }))
      })
    )
  }
}