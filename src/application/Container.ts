import Collection from '../api/utils/Collection'
import { MineralEvent } from '../core/entities/Event'
import { MineralBaseCommand } from '../core/entities/Command'
import { MineralContextMenu } from '../core/entities/ContextMenu'
import Scheduler from '../core/entities/tasks/Scheduler'
import { MineralProvider } from '../core/entities/Provider'

export default class Container {
  public events: Collection<string, Map<string, MineralEvent>> = new Collection()
  public commands: Collection<string, MineralBaseCommand> = new Collection()
  public menus: Collection<string, MineralContextMenu> = new Collection()
  public schedulers: Collection<string, Scheduler> = new Collection()
  public providers: Collection<string, MineralProvider> = new Collection()
}