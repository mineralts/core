import Request from './Request'
import Response from './Response'

export default interface HttpRequest {
  request: Request
  response: Response
}