import { MessageOption } from '../../../api/types'
import Button from '../button'
import Interaction from './index'

export default interface ButtonInteraction extends Interaction {
  readonly component: Button | undefined

  reply (messageOption: MessageOption): Promise<void>
}