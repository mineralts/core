import Message from '../message'
import GuildMember from '../guild/GuildMember'
import Guild from '../guild/Guild'
import TextChannelResolvable from '../channels/TextChannelResolvable'
import { InteractionType, Snowflake } from '../../../api/types'

export default interface MenuInteraction {
  readonly type: keyof typeof InteractionType
  readonly id: Snowflake,
  readonly version: number,
  readonly token: string,
  readonly member: GuildMember,
  readonly channel: TextChannelResolvable | undefined,
  readonly guild: Guild | undefined,
  readonly params: any

  getTargetMessage (): Message | undefined
  getTargetMember (): GuildMember | undefined
}