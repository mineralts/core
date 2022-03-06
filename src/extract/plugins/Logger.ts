import Application from '../../application/Application'
import { DateTime } from 'luxon'
import { BuildResult, PluginBuild } from 'esbuild'

const logger = Application.singleton().resolveBinding('Mineral/Core/Logger')
const environment = Application.singleton().resolveBinding('Mineral/Core/Environment')
const appName = environment.resolveKey('appName')

export default {
  name: 'logger',
  setup(build: PluginBuild) {
    const startTime = DateTime.now()
    build.onStart(() => {
      logger.info(`Start compiling the project : ${appName}`)
      logger.info(`Files expected during compilation : ${build.initialOptions.entryPoints?.length} files`)
    })

    build.onEnd((result: BuildResult) => {
      const endTime = DateTime.now().diff(startTime).toMillis()
      logger.info(`End of compilation with ${result.errors.length} errors (${endTime} milliseconds)`)
    })
  },
}