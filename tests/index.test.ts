import { afterAll, describe, expect, test } from 'vitest'
import fs from 'fs'
import mineralrc from '../mocks/mineralrc'
import { join } from 'node:path'
import { tmpdir } from 'os'

describe('Create Kernel application', async () => {
  const tmpFolder = await fs.promises.mkdtemp(join(tmpdir(), 'test-@mineralts-core'))

  test('Create temp dir', async () => {
    expect(tmpFolder).toEqual(tmpFolder)
  })

  describe('Create files', async () => {
    const rcLocation = join(tmpFolder, '.mineralrc.json')
    const jsonLocation = join(tmpFolder, 'package.json')
    const envLocation = join(tmpFolder, 'env.yaml')

    await Promise.all([
      fs.promises.writeFile(rcLocation, JSON.stringify(mineralrc), 'utf8'),
      fs.promises.writeFile(jsonLocation, JSON.stringify(mineralrc), 'utf8'),
      fs.promises.writeFile(envLocation, JSON.stringify(mineralrc), 'utf8')
    ])

    test('Exist .mineralrc.json', async () => {
      expect(rcLocation).exist
    })

    test('Exist jsonPackage', async () => {
      expect(jsonLocation).exist
    })

    test('Exist jsonPackage', async () => {
      expect(envLocation).exist
    })
  })

  afterAll(async () => {
    await fs.promises.rmdir(tmpFolder, { recursive: true })
  })
})
