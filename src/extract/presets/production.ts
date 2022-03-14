import { fetch } from 'fs-recursive'
import Application from '../../application/Application'
import fs from 'node:fs'
import { join } from 'node:path'
import Logger from '../plugins/Logger'
import Alias from '../plugins/Alias'

export default async function () {
  const environment = Application.singleton().resolveBinding('Mineral/Core/Environment')
  const buildOptions = environment.resolveKey('BUILD')
  const alias = environment.resolveKey('RC_FILE')?.aliases

  const buildLocation = join(process.cwd(), buildOptions?.OUT_DIR || 'build')
  const buildDir = fs.existsSync(buildLocation)

  if (buildDir) {
    await fs.promises.rm(buildLocation, { recursive: true })
  }

  const files = await fetch(
    process.cwd(),
    ['ts'],
    'utf-8',
    ['node_modules', 'build', 'export']
  )

  const includeFile = await Promise.all(
    Array.from(files).map(async ([, file]) => {
      const content = await file.getContent('utf-8') as string
      if (!content?.startsWith('// mineral-ignore')) {
        return file.path
      }
    })
  )

  const registeredAlias = {}

  Object.entries(alias!).forEach(([key, location]) => {
    registeredAlias[key] = join(process.cwd(), location)
  })

  return {
    entryPoints: includeFile.filter((file: string | undefined) => file) as string[],
    platform: 'node',
    outdir: buildOptions?.OUT_DIR || 'build',
    target: ['esnext'],
    minify: buildOptions?.MINIFY || false,
    format: 'cjs',
    globalName: 'mineral',
    plugins: [
      Logger,
      Alias(registeredAlias)
    ]
  } as any
}