import { InteractionType, MessageComponentResolvable, MessageOption, Snowflake } from '../../types'
import Message from '../message'
import GuildMember from '../guild/GuildMember'
import Interaction from './index'
import EmbedRow from '../embed/EmbedRow'
import Application from '../../../application/Application'

export default class ButtonInteraction extends Interaction {
  constructor (
    id: Snowflake,
    version: number,
    token: string,
    message: Message,
    member: GuildMember,
    customId: string,
  ) {
    super(id, version, 'MESSAGE_COMPONENT', token, customId, 'BUTTON', message, member)
  }

  public async pass () {
    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
    await request.post(`/interactions/${this.id}/${this.token}/callback`, {
      type: InteractionType.DEFERRED_UPDATE_MESSAGE,
      data: {
        flags: null,
      },
    })
  }

  public async reply (messageOption: MessageOption): Promise<void> {
    const request = Application.singleton().resolveBinding('Mineral/Core/Http')
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
        flags: messageOption.private ? 1 << 6 : undefined,
      }
    })
  }
}