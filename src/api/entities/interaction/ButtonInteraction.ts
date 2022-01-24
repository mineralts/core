import { InteractionType, MessageComponentResolvable, MessageOption, Snowflake } from '../../types'
import Message from '../message'
import GuildMember from '../guild/GuildMember'
import Button from '../button'
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
    public component: Button | undefined,
  ) {
    super(id, version, 'MESSAGE_COMPONENT', token, component?.customId, 'BUTTON', message, member)
  }

  public async pass () {
    const request = Application.createRequest()
    await request.post(`/interactions/${this.id}/${this.token}/callback`, {
      type: InteractionType.DEFERRED_UPDATE_MESSAGE,
      data: {
        flags: null,
      },
    })
  }

  public async reply (messageOption: MessageOption): Promise<void> {
    const request = Application.createRequest()
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