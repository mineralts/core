import Collection from '../../api/utils/Collection'
import { MineralContextMenu } from '../entities/ContextMenu'
import Application from '../../application/Application'
import { Client } from '../../typing/interfaces'

export default class MineralContextMenusService {
  public collection: Collection<string, MineralContextMenu> = new Collection()

  public register (path, item: { new (): MineralContextMenu } & { permissions: any }): void {
    const logger = Application.singleton().resolveBinding('Mineral/Core/Logger')
    const client = Application.singleton().resolveBinding('Mineral/Core/Client')
    const menus = Application.singleton().resolveBinding('Mineral/Core/ContextMenus')
    const menu = new item() as MineralContextMenu & { name: string, permissions: any[] }

    menu.logger = logger
    menu.client = client as unknown as Client

    menu.data = {
      permissions: item.permissions
    }

    if (menus.collection.get(menu.name)) {
      logger.fatal(`The ${menu.name} menu already exists, please choose another name`)
      return
    }

    menus.collection.set(menu.name, menu)
  }
}