import Collection from '../../api/utils/Collection'
import { MineralBaseCommand } from '../entities/Command'

export default class MineralCommandService {
  public collection: Collection<string, MineralBaseCommand> = new Collection()
}