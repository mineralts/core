import WebSocket from 'ws'
import { DateTime } from 'luxon'

export default class Reflect {
  public webSocket: WebSocket = new WebSocket('ws://127.0.0.1:4444')

  public createClient () {
    this.webSocket.on('open', () => {
      this.webSocket.send(JSON.stringify({
        type: 'ACTION',
        msg: 'COUCOU'
      }))
    })
  }

  public sendEvent (packetType: string, value: any) {
    this.webSocket.send(this.safeStringify({
      type: 'EVENT',
      event: packetType,
      date: DateTime.now().toISO(),
      payload: value
    }))
  }

  public sendAction (packetType: string, value: any) {
    this.webSocket.send(this.safeStringify({
      type: 'ACTION',
      date: DateTime.now().toISO(),
      payload: value
    }))
  }

  public sendNotification (action: string, message: any) {
    this.webSocket.send(JSON.stringify({
      type: 'NOTIFICATION',
      action,
      message,
    }))
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