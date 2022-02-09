import CommandOptions from './CommandOptions'
import Guild from '../guild/Guild'
import Interaction from './index'

export default interface CommandInteraction extends Interaction {
  readonly options: CommandOptions
  readonly guild: Guild | undefined
}