import Collection from '../../api/utils/Collection'
import { Status } from '../types'
import Http from '../http'
import Shard from '../shards/Shard'
import WebSocket from 'ws'
import Application from '../../application/Application'
import { sleep } from '../../api/utils'
import { Snowflake } from '../../api/types'
import Guild from '../../api/entities/guild/Guild'

export default class WebSocketManager {
  public websocket?: WebSocket
  public websocketEndpoint: string
  public sessionId: string
  public totalShards: number
  public shards: Collection<number, Shard> = new Collection()
  public shardQueue: Set<Shard> = new Set()
  public status: Status = Status.IDLE
  public reconnecting = false

  constructor (public application: Application, private http: Http, private options: any) {
    this.totalShards = options.totalShards
  }

  public async connect () {
    const version = '/v9/gateway/bot'
    const { endpoint, shards } = await this.getDiscordWebsocket(version)

    this.websocketEndpoint = endpoint

    const shardsArray = Array.from({ length: shards }, (_, i: number) => i)
    if (this.options.shards === 'auto') {
      this.totalShards = shardsArray.length
    }

    shardsArray.forEach((id: number) => {
      this.shardQueue.add(new Shard(this, id))
    })

    this.websocket = new WebSocket(this.websocketEndpoint + version)

    await this.createShards()
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

  private async createShards () {
    this.application.logger.info('Create shard with shard : ' + this.shardQueue.size)
    if (!this.shardQueue.size) {
      return false
    }

    const [shard] = this.shardQueue
    this.shardQueue.delete(shard)

    shard.on('shards:ready', (guilds: Collection<Snowflake, Guild>) => {
      this.websocket?.emit('ready:shard', shard, guilds)

      if (!this.shardQueue.size) {
        this.reconnecting = false
      }
    })

    shard.on('close', async (event) => {
      console.log(1, event)
      if (event.code === 1_000) {
        this.websocket?.emit('disconnect:shard', event, shard)
        return
      }

      this.status = Status.RECONNECTING
      this.websocket?.emit('reconnect:shard', shard)
      this.shardQueue.add(shard)

      if (!shard.sessionId) {
        shard.destroy(1_000, true)
      }

      await this.reconnect()
    })

    shard.on('delete:shard', () => {
      this.websocket?.emit('reconnect:shard', shard)

      this.shardQueue.add(shard)
      this.reconnect()
    })

    this.shards.set(shard.id, shard)

    try {
      await shard.connect()
    } catch (error) {}

    if (this.shardQueue.size) {
      this.application.logger.error(`Shard Queue Size: ${this.shardQueue.size}; continuing in 5 seconds...`)
      await sleep(5000)
      return this.createShards()
    }
  }

  private async reconnect () {
    console.log(2, this.reconnecting, this.status, this.status !== Status.READY)
    if (this.reconnecting) {
      return
    }

    this.reconnecting = true

    try {
      await this.createShards()
    } catch (error: any) {
      this.application.logger.error('ERROR')
      if (error.httpStatus !== 401) {
        this.application.logger.error('Possible network error occurred. Retrying in 5s...')

        await sleep(5000)

        this.reconnecting = false
        return this.reconnect()
      }
    } finally {
      this.reconnecting = false
    }
  }
}