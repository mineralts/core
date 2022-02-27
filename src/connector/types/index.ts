export enum Status {
  READY = 'Ready',
  CONNECTING = 'Connecting',
  RECONNECTING = 'Reconnecting',
  IDLE = 'Idle',
  NEARLY = 'Nearly',
  DISCONNECTED = 'Disconnected',
  IDENTIFYING = 'Identifying',
  RESUMING = 'Resuming',
}

export enum Opcode {
  DISPATCH_EVENT = 0,
  HEARTBEAT = 1,
  IDENTIFY = 2,
  PRESENCE_UPDATE = 3,
  VOICE_STATE_UPDATE = 4,
  RESUME = 6,
  RECONNECT = 7,
  REQUEST_GUILD_MEMBER = 8,
  INVALID_SESSION = 9,
  HELLO = 10,
  HEARTBEAT_ACK = 11,
}

type JsonObject<T> =  {
  [K: string]: T
}

export type WebsocketPayload = {
  op: Opcode
  t: string,
  d: JsonObject<any>
  s: number
}