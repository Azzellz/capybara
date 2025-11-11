/* eslint-disable @typescript-eslint/no-explicit-any */
import { Config, RemoveFirstParamFromFunctions, WireGuardClient } from '@shared/types'
import _WireGuardAPI from 'wg-easy-api'
const WireGuardAPI = (_WireGuardAPI as any).default || _WireGuardAPI
import { store } from './store'
import { parseURL, parseWireGuardConfig } from '@shared/utils'
import { exitApp } from './utils/system'

let _API

let prevClients: WireGuardClient[] = []
export const API = {
  async getClients(): Promise<WireGuardClient[]> {
    try {
      const result = await _API.getClients()
      const clients = result.data as WireGuardClient[]
      // diff
      if (prevClients.length) {
        for (let i = 0; i < clients.length; i++) {
          clients[i].transferRxDiff = clients[i].transferRx - prevClients[i].transferRx
          clients[i].transferTxDiff = clients[i].transferTx - prevClients[i].transferTx
        }
      }
      prevClients = clients
      return clients || []
    } catch (error) {
      console.log(error)
      return []
    }
  },
  async getClientsWithConfig(): Promise<WireGuardClient[]> {
    try {
      const clients = await API.getClients()
      for (const client of clients) {
        const configResult = await (
          await _API
        ).getClientConfig({
          clientId: client.id
        })
        client.configStr = configResult.data || ''
        client.config = parseWireGuardConfig(client.configStr)
      }
      return clients
    } catch (error) {
      console.log(error)
      return []
    }
  },
  async initSession(_?: any, configStr?: string): Promise<boolean> {
    try {
      let config: Config
      if (configStr) {
        config = JSON.parse(configStr)
      } else {
        config = store.get('config')
      }
      if (!config) exitApp(`Can't read config from local`)
      const { protocol, hostname, port } = parseURL(config.url)
      const password =
        import.meta.env.MAIN_VITE_SECRET || (config.password.enable ? config.password.value : '')
      const _testAPI = new WireGuardAPI(protocol, hostname, port)
      const result = await _testAPI.initSession({ password })
      const isValid = result.statusCode !== 401
      if (isValid) {
        _API = _testAPI
      }
      return isValid
    } catch (error) {
      console.log(error)
      return false
    }
  }
}
export type API = RemoveFirstParamFromFunctions<typeof API>
