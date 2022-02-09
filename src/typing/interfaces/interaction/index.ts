import { ComponentType, InteractionType, MessageOption, Snowflake } from '../../../api/types'
import Message from '../message'
import GuildMember from '../guild/GuildMember'
import Modal from '../../../api/entities/modal'

export default interface Interaction {
  readonly id: Snowflake
  readonly version: number
  readonly type: keyof typeof InteractionType
  readonly token: string
  readonly customId: string | undefined
  readonly componentType: keyof typeof ComponentType | undefined
  readonly message: Message | undefined
  readonly member: GuildMember

  reply (messageOption: MessageOption): Promise<void>
  createModal (modal: Modal): Promise<void>
}