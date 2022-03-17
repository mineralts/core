import { ChannelTypeResolvable, Snowflake } from '../../../api/types'
import Guild from '../guild/Guild'
import CategoryChannel from './CategoryChannel'

export default interface Channel {
  readonly id: Snowflake
  readonly type: keyof typeof ChannelTypeResolvable
  readonly name: string
  readonly guildId: Snowflake
  readonly guild: Guild | undefined
  readonly parentId: Snowflake | undefined
  readonly position: number
  readonly parent?: CategoryChannel

  isText (): boolean
  isVoice (): boolean
  isNews (): boolean
  isCategory (): boolean
  isStage (): boolean
  isThread (): boolean
  setParent (category: CategoryChannel | Snowflake): Promise<void>
  setName (value: string): Promise<void>
  setPosition (position: number): Promise<void>
  delete (): Promise<void>
}