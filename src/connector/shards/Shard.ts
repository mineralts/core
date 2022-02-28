import WebSocketManager from '../managers/WebSocketManager'
import { Opcode, Status, WebsocketPayload } from '../types'
import { Observable, Subscriber } from 'rxjs'
import { Data } from 'ws'
import HearthBeatManager from '../managers/HearthBeatManager'
import { keyFromEnum } from '../../api/utils'
import { EventEmitter } from 'node:events'

enum WebSocketState {
  OPEN,
  CLOSING,
  CLOSED
}

export default class Shard extends EventEmitter {
  private reactor: Observable<any>
  public sessionId: string | null = null
  public status: Status = Status.IDLE
  public sequence: number = -1
  private closeSequence: number | null = null
  private heartbeatManager = new HearthBeatManager(this)

  constructor (public manager: WebSocketManager, public id: number) {
    super()
  }
  
  public connect () {
    this.reactor = new Observable((observer: Subscriber<any>) => {
      this.manager.websocket?.on('message', (data: Data) => {
        const payload = JSON.parse(data.toString())
        observer.next(payload)
      })
    })

    this.manager.websocket?.on('close', async (code: number) => {
      this.heartbeatManager.shutdown()
      this.manager.application.logger.fatal('Socket disconnected with ' + code + ' code.')
    })

    this.manager.websocket?.on('open', () => {
      if (this.manager.application.debug) {
        this.manager.application.logger.info('Socket opened')
      }
    })
  }

  private identify () {
    const request = this.request(Opcode.IDENTIFY, {
      token: this.manager.application.environment.cache.get('TOKEN'),
      properties: { $os: process.arch },
      compress: false,
      large_threshold: 250,
      intents: this.manager.application.intents,
      shard: [this.id, Number(this.manager.totalShards)]
    })

    this.manager.websocket?.send(request)
  }


  public dispatch (callback: (payload: WebsocketPayload) => any) {
    this.reactor.subscribe((payload: any) => {
      this.heartbeatManager.watchSession(payload.d?.session_id)
      this.opCodeActionHook(payload)

      if (payload.s) {
        this.sequence = payload.s
      }

      callback(payload)
    })
  }

  public request (code: Opcode, payload): Buffer {
    return Buffer.from(
      JSON.stringify({
        op: code,
        d: payload,
      })
    )
  }

  public destroy (closeCode: number = 1_000, reset: boolean = false) {
    this.heartbeatManager.shutdown()
    if (this.manager.websocket?.readyState === WebSocketState.OPEN) {
      this.manager.websocket?.close(closeCode)
    } else {
      this.manager.websocket?.removeAllListeners()

      try {
        this.manager.websocket?.close(closeCode)
      } catch (error) {}

      this.manager.websocket = undefined
      this.status = Status.DISCONNECTED

      if (this.sequence !== -1) {
        this.closeSequence = this.sequence
      }

      if (reset) {
        this.sequence = -1
        this.sessionId = null
      }
    }
  }

  protected opCodeActionHook (payload) {
    const codes: { [K in keyof typeof Opcode]?: () => void } = {
      'HELLO': () => hello(),
      'RECONNECT': () => reconnect(),
    }

    const hello = () => {
      this.heartbeatManager.beat(payload.d.heartbeat_interval)
      this.identify()
    }
    const reconnect = () => {
      this.manager.application.logger.info('Reconnecting..')
      this.destroy(4_000)
    }

    const op = keyFromEnum(Opcode, payload.op)
    if (op in codes) {
      codes[op]!()
    }
  }
}