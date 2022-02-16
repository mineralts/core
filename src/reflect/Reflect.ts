import WebSocket, { Server } from 'ws'
import { DateTime } from 'luxon'

export default class Reflect {
  public server: Server = new Server({ host: '127.0.0.1', port: 4444 })
  public clients: WebSocket[] = []

  public createClient () {
    this.server.on('connection', (client: WebSocket) => {
      this.clients.push(client)
    })

    this.server.on('close', () => {
      this.sendNotification('RECONNECT', 'Please reconnect.')
    })
  }

  public sendEvent (packetType: string, value: any) {
    this.clients.forEach((client: WebSocket) => {
      client.send(this.safeStringify({
        type: 'EVENT',
        event: packetType,
        date: DateTime.now().toISO(),
        payload: value
      }))
    })
  }

  public sendNotification (action: string, message: any) {
    this.clients.forEach((client: WebSocket) => {
      client.send(JSON.stringify({
        type: 'NOTIFICATION',
        action,
        message,
      }))
    })
  }

  private safeStringify = (obj, indent = 2) => {
    let cache: any[] = []
    const retVal = JSON.stringify(
      obj,
      (key, value) =>
        typeof value === 'object' && value !== null
          ? cache.includes(value)
            ? undefined // Duplicate reference found, discard key
            : cache.push(value) && value // Store value in our collection
          : value,
      indent
    )
    cache = []
    return retVal
  }
}