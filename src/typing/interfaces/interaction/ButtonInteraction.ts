import { MessageOption } from '../../../api/types'
import Interaction from './index'

export default interface ButtonInteraction extends Interaction {
  pass (): Promise<void>

  reply (messageOption: MessageOption): Promise<void>
}