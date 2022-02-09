import { ModalComponent, Snowflake } from '../../types'
import GuildMember from '../guild/GuildMember'
import Guild from '../guild/Guild'
import Interaction from './index'

export default class ModalInteraction extends Interaction {
  constructor (
    id: Snowflake,
    version: number,
    token: string,
    member: GuildMember,
    public guild: Guild | undefined,
    customId: string,
    public components: ModalComponent<unknown>[]
  ) {
    super(id, version, 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE', token, customId, undefined, undefined, member)
  }

  public getInput (customId: string) {
    const component = this.components.find((component: ModalComponent<unknown>) => (
      component.customId === customId
    ))

    return component?.type === 'TEXT_INPUT'
      ? component
      : undefined
  }
}