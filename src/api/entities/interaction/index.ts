import { ComponentType, InteractionType, MessageComponentResolvable, MessageOption, Snowflake } from '../../types'
import Message from '../message'
import GuildMember from '../guild/GuildMember'
import Ioc from '../../../Ioc'
import EmbedRow from '../embed/EmbedRow'
import Modal from '../modal'

export default class Interaction {
  constructor (
    public id: Snowflake,
    public version: number,
    public type: keyof typeof InteractionType,
    public token: string,
    public customId: string | undefined,
    public componentType: keyof typeof ComponentType | undefined,
    public message: Message | undefined,
    public member: GuildMember
  ) {
  }

  public async reply (messageOption: MessageOption): Promise<void> {
    const request = Ioc.singleton().resolve('Mineral/Core/Http')
    const components = messageOption.components?.map((row: EmbedRow) => {
      row.components = row.components.map((component: MessageComponentResolvable) => {
        return component.toJson()
      }) as any[]
      return row
    })

    await request.post(`/interactions/${this.id}/${this.token}/callback`, {
      type: InteractionType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        ...messageOption,
        components,
        flags: messageOption.private ? 1 << 6 : undefined
      }
    })
  }

  public async createModal (modal: Modal) {
    const request = Ioc.singleton().resolve('Mineral/Core/Http')

    await request.post(`/interactions/${this.id}/${this.token}/callback`, {
      type: InteractionType.MODAL_SUBMIT,
      data: modal.toJson()
    })
  }
}