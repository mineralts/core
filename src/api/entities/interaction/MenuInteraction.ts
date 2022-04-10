import { InteractionType, Snowflake } from '../../types'
import Message from '../message'
import GuildMember from '../guild/GuildMember'
import Ioc from '../../../Ioc'
import Guild from '../guild/Guild'
import TextChannelResolvable from '../channels/TextChannelResolvable'

export default class MenuInteraction {
  public type: keyof typeof InteractionType = 'APPLICATION_COMMAND'

  constructor (
    public id: Snowflake,
    public version: number,
    public token: string,
    public member: GuildMember,
    public channel: TextChannelResolvable | undefined,
    public guild: Guild | undefined,
    public params: any
  ) {
  }

  public getTargetMessage (): Message | undefined {
    if (!this.guild) {
      const console = Ioc.singleton().resolve('Mineral/Core/Console')
      console.logger.error(new Error('Menu interactions are not yet implemented in private channels'))
      return undefined
    }
    return this.channel?.messages.cache.get<Message>(this.params.target_id)
  }

  public getTargetMember (): GuildMember | undefined {
    if (!this.guild) {
      const console = Ioc.singleton().resolve('Mineral/Core/Console')
      console.logger.error(new Error('Menu interactions are not yet implemented in private channels'))
      return undefined
    }
    return this.guild.members.cache.get(this.params.target_id) || this.guild.bots.cache.get(this.params.target_id)
  }
}