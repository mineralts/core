/*
 * packages/connector.transformerBefore.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import axios, { Axios, AxiosRequestConfig, AxiosResponse } from 'axios'
import { DateTime } from 'luxon'
import Application from '../../application/Application'

export default class Http {
  private emitter = Application.singleton().resolveBinding('Mineral/Core/Emitter')
  private axios: Axios = axios.create({
    baseURL: 'https://discord.com/api'
  })

  constructor () {
    this.axios.interceptors.response.use((response: AxiosResponse) => {
      return response
    }, (error) => {
      if (error.response.status === 429) {
        const { url, method } = error.config
        const { global, retry_after } = error.response.data
        this.emitter.emit('rateLimit', { global, url, method, retryAfter: DateTime.now().plus({ millisecond: retry_after }) })
        return { status: 429 }
      } else if (error.response.status === 503) {
        throw new Error(`[${error.response.status}] ${error.response.data}`)
      } else {
        return Promise.reject(error)
      }
    })
  }

  public async get (url: string, options?: AxiosRequestConfig) {
    return this.axios.get(url, options)
  }

  public async post (url: string, payload, options?: AxiosRequestConfig) {
    return this.axios.post(url, payload, options)
  }

  public async put (url: string, payload, options?: AxiosRequestConfig) {
    return this.axios.put(url, payload, options)
  }

  public async patch (url: string, payload, options?: AxiosRequestConfig) {
    return this.axios.patch(url, payload, options)
  }

  public async delete (url: string, options?: AxiosRequestConfig) {
    return this.axios.delete(url, options)
  }

  /**
   * Define default axios headers
   * @param headers
   */
  public defineHeaders (headers) {
    Object.entries(headers).forEach(([key, value]: [string, any]) => {
      this.axios.defaults.headers.common[key] = value
    })
  }

  public resetHeaders (...headers: string[]) {
    Object.entries(headers).forEach(([key]: [string, string]) => {
      delete this.axios.defaults.headers.common[key]
    })
  }
}