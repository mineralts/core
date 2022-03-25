import Application from '../../application/Application'
import { DateTime } from 'luxon'
import { BuildResult, PluginBuild } from 'esbuild'

const console = Application.singleton().resolveBinding('Mineral/Core/Console')
const environment = Application.singleton().resolveBinding('Mineral/Core/Environment')
const appName = environment.resolveKey('APP_NAME')

export default {
  name: 'logger',
  setup(build: PluginBuild) {
    const startTime = DateTime.now()
    build.onStart(() => {
      console.logger.info(`Start compiling the project : ${appName}`)
      console.logger.info(`Files expected during compilation : ${build.initialOptions.entryPoints?.length} files`)
    })

    build.onEnd((result: BuildResult) => {
      const endTime = DateTime.now().diff(startTime).toMillis()
      console.logger.info(`End of compilation with ${result.errors.length} errors (${endTime} milliseconds)`)
    })
  },
}