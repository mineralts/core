import { ComponentType, InteractionType, Snowflake } from '../../../api/types'
import Message from '../message'
import GuildMember from '../guild/GuildMember'

export default interface SelectMenuInteraction {
  readonly id: Snowflake
  readonly version: number
  readonly type: keyof typeof InteractionType
  readonly token: string
  readonly customId: string | undefined
  readonly componentType: keyof typeof ComponentType | undefined
  readonly message: Message | undefined
  readonly member: GuildMember
}