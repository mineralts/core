export default interface Request {
  status: number
  statusText: string
  url: string
  headers: { [K: string]: string }
  method: 'GET' | 'POST' | 'PUT' | 'PATH' | 'DELETE'
  data?: any
}