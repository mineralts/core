import Collection from '../../api/utils/Collection'
import { Opcode, Status, WebsocketPayload } from '../types'
import Http from '../http'
import Shard from '../shards/Shard'
import { Observable, Subscriber } from 'rxjs'
import WebSocket, { Data } from 'ws'
import Application from '../../application/Application'
import HearthBeatManager from './HearthBeatManager'

export default class WebSocketManager {
  public websocket: WebSocket
  private reactor: Observable<any>
  public websocketEndpoint: string
  public sessionId: string
  private heartbeatManager = new HearthBeatManager(this)
  public totalShards: number
  public shards = new Collection()
  public shardQueue = new Set()
  public packetQueue: any[] = []
  public status: Status = Status.IDLE
  public reconnecting = false

  constructor (public application: Application, private http: Http, private options: any) {
    this.totalShards = options.totalShards
  }

  public ping () {
    const sum = this.shards.reduce((acc, current: any) => acc + current.ping, 0)
    return sum / this.shards.size
  }

  public async connect () {
    if (!this.application.environment.cache.get('TOKEN')) {
      throw new Error('No token has been defined.')
    }

    const version = '/v9/gateway/bot'
    const { endpoint, shards } = await this.getDiscordWebsocket(version)

    this.websocketEndpoint = endpoint

    const shardsArray = Array.from({ length: shards }, (_, i: number) => i)
    if (this.options.shards === 'auto') {
      this.totalShards = shardsArray.length
    }

    shardsArray.forEach((id: number) => {
      this.shardQueue.add(new Shard(id))
    })

    this.websocket = new WebSocket(this.websocketEndpoint + version)

    this.reactor = new Observable((observer: Subscriber<any>) => {
      this.websocket.on('message', (data: Data) => {
        const payload = JSON.parse(data.toString())
        observer.next(payload)
      })
    })

    this.websocket.on('close', async (code: number) => {
      this.heartbeatManager.shutdown()
      this.websocket.terminate()
      this.application.logger.fatal('Socket disconnected with ' + code + ' code.')
    })

    this.websocket.on('open', () => {
      if (this.application.debug) {
        this.application.logger.info('Socket opened')
      }

      const request = this.request(Opcode.IDENTIFY, {
        token: this.application.environment.cache.get('TOKEN'),
        properties: { $os: process.arch },
        compress: false,
        large_threshold: 250,
        intents: this.application.intents
      })

      this.websocket.send(request)
    })

    this.createShards()
  }

  private async getDiscordWebsocket (version: string): Promise<any> {
    try {
      const { data } = await this.http.get(version)
      return {
        endpoint: data.url,
        shards: data.shards,
        ...data.session_start_limit
      }
    } catch (error: any) {
      throw error.httpStatus === 401 ? new Error('Invalid token') : error
    }
  }

  private createShards () {
    if (!this.shardQueue.size) {
      return false
    }

    const [shard] = this.shardQueue as any
    this.shardQueue.delete(shard)
  }

  public dispatch (callback: (payload: WebsocketPayload) => any) {
    this.reactor.subscribe((payload: any) => {
      this.heartbeatManager.watchSession(payload.d?.session_id)

      if (payload.op === Opcode.HELLO) {
        this.heartbeatManager.beat(payload.d.heartbeat_interval)
      }

      callback(payload)
    })
  }

  public request (code: Opcode, payload): Buffer {
    return Buffer.from(
      JSON.stringify({
        op: code,
        d: payload
      })
    )
  }
}