import { ComponentType, InteractionType, Snowflake } from '../../types'
import Message from '../message'
import GuildMember from '../guild/GuildMember'
import CommandOptions from './CommandOptions'
import Guild from '../guild/Guild'
import Interaction from './index'

export default class CommandInteraction extends Interaction {
  public options: CommandOptions

  constructor (
    id: Snowflake,
    version: number,
    type: keyof typeof InteractionType,
    token: string,
    customId: string | undefined,
    componentType: keyof typeof ComponentType | undefined,
    message: Message | undefined,
    member: GuildMember,
    public guild: Guild | undefined,
    public params: any
  ) {
    super(id, version, type, token, customId, componentType, message, member)
    this.options = new CommandOptions(this.params, this.member)
  }
}