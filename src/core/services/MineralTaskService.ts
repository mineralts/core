import Collection from '../../api/utils/Collection'
import Scheduler from '../entities/tasks/Scheduler'

export default class MineralTaskService {
  public collection: Collection<string, Scheduler> = new Collection()
}