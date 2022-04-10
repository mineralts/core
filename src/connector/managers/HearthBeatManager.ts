/*
 * @mineralts/HearthBeat.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { Opcode } from '../types'
import Shard from '../shards/Shard'
import Ioc from '../../Ioc'

export default class HearthBeatManager {
  private scheduler: any
  private console = Ioc.singleton().resolve('Mineral/Core/Console')
  constructor (private shard: Shard) {
  }

  public watchSession (sessionId: string) {
    if (sessionId) {
      this.shard.manager.sessionId = sessionId
    }
  }

  public beat (interval: number) {
    this.scheduler = setInterval(() => {
      const request = this.shard.request(Opcode.HEARTBEAT, this.shard.sequence)

      this.shard.manager.websocket?.send(request)

      if (this.shard.manager.application.debug) {
        this.console.logger.info('Sending a heartbeat')
      }
    }, interval)
  }

  public shutdown () {
    clearInterval(this.scheduler)
  }
}