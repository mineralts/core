import Collection from '../../api/utils/Collection'
import Application from '../../application/Application'
import { fetch } from 'fs-recursive'
import fs from 'node:fs'
import { MineralProvider } from '../entities/Provider'
import { join } from 'node:path'

export default class MineralProviderService {
  public collection: Collection<string, MineralProvider> = new Collection()

  public async register () {
    const environment = Application.singleton().resolveBinding('Mineral/Core/Environment')
    const logger = Application.singleton().resolveBinding('Mineral/Core/Logger')
    const root = environment?.resolveKey('APP_ROOT')
    const mode = environment?.resolveKey('APP_MODE')

    const extensions = [mode === 'development' ? 'ts': 'js']

    const files = await fetch(
      root!,
      extensions,
      'utf-8',
      ['node_modules', 'build', 'export']
    )

    for (const [, file] of files) {
      const content = await fs.promises.readFile(file.path, 'utf-8')
      if (!content.startsWith('// mineral-ignore')) {
        try {
          const { default: item } = await import(file.path)
          if (item && item.identifier === 'provider') {
            const provider = new item() as MineralProvider
            provider.logger = logger!
            provider.application = Application.singleton()

            this.collection.set(item.path, provider)
          }
        } catch (err) {}
      }
    }


    const rcFile = environment.resolveKey('RC_FILE')
    await Promise.all(
      rcFile!.providers.map(async (moduleName: string) => {
        const moduleLocation = join(process.cwd(), 'node_modules', moduleName)
        const { default: jsonPackage } = await import(join(moduleLocation, 'package.json'))

        const providerLocation = join(moduleLocation, jsonPackage['@mineralts']['provider'])
        try {
          const { default: Provider } = await import(providerLocation)

          const provider = new Provider()
          provider.logger = logger!
          provider.application = Application.singleton()

          this.collection.set(providerLocation, provider)
        } catch (err) {}
      })
    )
  }
}