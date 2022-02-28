import Http from './http'
import WebSocketManager from './managers/WebSocketManager'
import EventsListener from '../assembler/EventsListener'
import Application from '../application/Application'

export default class Connector {
  public http: Http
  public websocketManager: WebSocketManager

  constructor (private application: Application, private eventEmitter: EventsListener) {
    this.http = new Http(eventEmitter)
    this.websocketManager = new WebSocketManager(application, this.http, { shards: 'auto' })
  }
}