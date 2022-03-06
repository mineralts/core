import { OnLoadArgs, PluginBuild } from 'esbuild'import fs from 'node:fs'import { posix, dirname } from 'node:path'export default function(options) {  function replaceImportPathAliases (currentFilePath, fileContent, pathMap) {    const regex = createRegex(pathMap)    return fileContent.replace(regex, replacer)    function replacer (_, g1, aliasGrp, restPathGrp, g4) {      const mappedImportPath = pathMap[aliasGrp] + restPathGrp      let mappedImportPathRelative = posix.relative(dirname(currentFilePath), mappedImportPath)      if (!mappedImportPathRelative.startsWith('../')) {        mappedImportPathRelative = `./${mappedImportPathRelative}`      }      return g1 + mappedImportPathRelative + g4    }  }  function createRegex (pathMap) {    const mapKeysStr = Object.keys(pathMap).reduce((acc, cur) => `${acc}|${cur}`)    const regexStr = `^(import.*from\\s+["|'])(${mapKeysStr})(.*)(["|'])$`    return new RegExp(regexStr, 'gm')  }  return {    name: 'alias',    setup (build: PluginBuild) {      build.onLoad({ filter: /\.ts$/ }, async (args: OnLoadArgs) => {        const text = await fs.promises.readFile(args.path, 'utf-8')        const content = replaceImportPathAliases(args.path, text, options)        return {          contents: content,          loader: 'ts'        }      })    }  }}