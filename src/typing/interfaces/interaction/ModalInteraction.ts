import { ModalComponent } from '../../../api/types'
import Guild from '../guild/Guild'
import Interaction from './index'

export default interface ModalInteraction extends Interaction {
  readonly guild: Guild | undefined,
  readonly components: ModalComponent<unknown>[]

  getInput<T> (customId: string): ModalComponent<T> | undefined
}