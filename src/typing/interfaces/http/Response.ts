export default interface Response {
  status: number
  statusText: string
  url: string
  headers: { [K: string]: string }
  method: 'GET' | 'POST' | 'PUT' | 'PATH' | 'DELETE'
  payload: any
}