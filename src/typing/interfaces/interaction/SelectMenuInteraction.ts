import { MessageOption } from '../../../api/types'
import Interaction from './index'

export default interface SelectMenuInteraction extends Interaction {
  readonly values: string[]

  pass (): Promise<void>

  reply (messageOption: MessageOption): Promise<void>
}