import Collection from '../../api/utils/Collection'
import Application from '../../application/Application'
import { fetch } from 'fs-recursive'
import { join } from 'path'
import fs from 'fs'
import { MineralProvider } from '../entities/Provider'

export default class MineralProviderService {
  public collection: Collection<string, MineralProvider> = new Collection()

  public async register () {
    const environment = Application.singleton().resolveBinding('Mineral/Core/Environment')
    const logger = Application.singleton().resolveBinding('Mineral/Core/Logger')
    const providers = Application.singleton().resolveBinding('Mineral/Core/Providers')

    const root = environment?.resolveKey('root')
    const mode = environment?.resolveKey('mode')

    const location = mode === 'production' ? join(root!, 'build') : root!
    const extensions = [mode === 'production' ? 'js' : 'ts']

    const files = await fetch(
      location,
      extensions,
      'utf-8',
      ['node_modules', 'build', 'export']
    )

    for (const [, file] of files) {
      const content = await fs.promises.readFile(file.path, 'utf8')
      if (!content.startsWith('// mineral-ignore')) {
        const { default: item } = await import(file.path)
        if (item && item.identifier === 'provider') {
          const provider = new item() as MineralProvider
          provider.logger = logger!
          provider.application = Application.singleton()

          providers?.collection.set(item.path, provider)
        }
      }
    }
  }
}