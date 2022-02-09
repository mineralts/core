import { InteractionType, ModalComponent, Snowflake } from '../../../api/types'
import GuildMember from '../guild/GuildMember'
import Guild from '../guild/Guild'

export default interface ModalInteraction {
  type: keyof typeof InteractionType
  id: Snowflake,
  version: number,
  token: string,
  member: GuildMember,
  guild: Guild | undefined,
  customId: string,
  components: ModalComponent[]

  getInput (customId: string): ModalComponent | undefined
}