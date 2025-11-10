/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { WireGuardClient } from '@shared/types'
import _WireGuardAPI from 'wg-easy-api'
const WireGuardAPI = (_WireGuardAPI as any).default || _WireGuardAPI
import { store } from './store'
import { parseURL, parseWireGuardConfig } from '@shared/utils'
import { exitApp } from './utils/system'

async function initAPI(config = store.get('config')) {
  if (!config) exitApp(`Can't read config from local`)
  const { protocol, hostname, port } = parseURL(config.url)
  const api = new WireGuardAPI(protocol, hostname, port, import.meta.env.MAIN_VITE_SECRET)
  await api.initSession({ password: import.meta.env.MAIN_VITE_SECRET })
  return api
}

let _API = initAPI()
store.onDidChange('config', (newConfig, oldConfig) => {
  if (!newConfig || !oldConfig) return
  if (newConfig.url !== oldConfig.url) {
    _API = initAPI(newConfig)
  }
})

let prevClients: WireGuardClient[] = []
export const API = {
  async getClients(): Promise<WireGuardClient[]> {
    try {
      const result = await (await _API).getClients()
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
  }
}
export type API = typeof API
