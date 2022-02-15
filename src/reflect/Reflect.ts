import WebSocket, { Server } from 'ws'
import { DateTime } from 'luxon'

export default class Reflect {
  public websocketServer: Server
  public clients: WebSocket[] = []

  public createServer () {
    const websocketServer = new Server({ port: 4444 })

    websocketServer.on('connection', (ws) => {
      this.clients.push(ws)
      ws.send('something')
    })
  }

  public sendEvent (packetType: string, value: any) {
    const payload = this.safeStringify({
      type: 'event',
      event: packetType,
      date: DateTime.now().toISO(),
      payload: value
    })

    this.clients.forEach((client: WebSocket) => {
      client.send(payload)
    })
  }

  public sendNotification (action: string, message: any) {
    const payload = this.safeStringify({
      type: 'notification',
      action,
      message
    })

    this.clients.forEach((client: WebSocket) => {
      client.send(payload)
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