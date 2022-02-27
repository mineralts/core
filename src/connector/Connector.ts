import Http from './http'
import WebSocketManager from './managers/WebSocketManager'
import EventsListener from '../assembler/EventsListener'
import Application from '../application/Application'

export default class Connector {
  public http: Http = new Http()
  public websocketManager: WebSocketManager

  constructor (private application: Application, private eventEmitter: EventsListener) {
    this.websocketManager = new WebSocketManager(application, this.http, eventEmitter)
  }
}