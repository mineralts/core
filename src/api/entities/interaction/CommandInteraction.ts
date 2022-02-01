import {
  ComponentType,
  InteractionType,
  MessageComponentResolvable,
  MessageOption,
  Snowflake
} from '../../types'
import Message from '../message'
import GuildMember from '../guild/GuildMember'
import EmbedRow from '../embed/EmbedRow'
import CommandOptions from './CommandOptions'
import Application from '../../../application/Application'
import Guild from '../guild/Guild'

export default class CommandInteraction {
  public options: CommandOptions

  constructor (
    public id: Snowflake,
    public version: number,
    public type: keyof typeof InteractionType,
    public token: string,
    public customId: string | undefined,
    public componentType: keyof typeof ComponentType | undefined,
    public message: Message | undefined,
    public member: GuildMember,
    public guild: Guild | undefined,
    public params: any,
  ) {
    this.options = new CommandOptions(this.params, this.member)
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