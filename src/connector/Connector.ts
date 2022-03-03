import Http from './http'
import WebSocketManager from './managers/WebSocketManager'
import Application from '../application/Application'

export default class Connector {
  public http: Http
  public websocketManager: WebSocketManager

  constructor (private application: Application) {
    this.http = new Http()
    this.websocketManager = new WebSocketManager(application, this.http, { shards: 'auto' })
  }
}