/*
 * @mineralts/HearthBeat.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import WebSocketManager from './WebSocketManager'
import { Opcode } from '../types'

export default class HearthBeatManager {
  private scheduler: any
  constructor (private socketManager: WebSocketManager) {
  }

  public watchSession (sessionId: string) {
    if (sessionId) {
      this.socketManager.sessionId = sessionId
    }
  }

  public beat (interval: number) {
    this.scheduler = setInterval(() => {
      const request = this.socketManager.request(Opcode.HEARTBEAT, {
        session_id: this.socketManager.sessionId
      })

      this.socketManager.websocket.send(request)

      if (this.socketManager.application.debug) {
        this.socketManager.application.logger.info('Sending a heartbeat')
      }
    }, interval)
  }

  public shutdown () {
    clearInterval(this.scheduler)
  }
}