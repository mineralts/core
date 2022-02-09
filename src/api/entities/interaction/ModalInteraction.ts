import { InteractionType, ModalComponent, Snowflake } from '../../types'
import GuildMember from '../guild/GuildMember'
import Guild from '../guild/Guild'

export default class ModalInteraction {
  public type: keyof typeof InteractionType = 'CHANNEL_MESSAGE_WITH_SOURCE'

  constructor (
    public id: Snowflake,
    public version: number,
    public token: string,
    public member: GuildMember,
    public guild: Guild | undefined,
    public customId: string,
    public components: ModalComponent[]
  ) {
  }

  public getInput (customId: string) {
    const component = this.components.find((component: ModalComponent) => (
      component.customId === customId
    ))

    return component?.type === 'TEXT_INPUT'
      ? component
      : undefined
  }
}