import { IHttpRequest, IHttpResponse } from './IHttp'

export interface IController {
  handle: (httpRequest: IHttpRequest) => IHttpResponse
}
