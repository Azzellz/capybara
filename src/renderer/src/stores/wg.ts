/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { WireGuardStatus, type WireGuardClient } from '@shared/types'

export const useWgStore = defineStore('wg-store', () => {
  // current client part
  const currentClient = ref<WireGuardClient | null>(null)
  const setCurrentClient = (client: WireGuardClient | null) => {
    if (client === null && currentClient.value) {
      clientKeepAliveMap[currentClient.value.id] = false
    }
    currentClient.value = client
  }

  // running part
  const isWgRunning = ref(false)
  const setIsWgRunning = (running: boolean) => {
    isWgRunning.value = running
  }

  // status part
  const status = ref<WireGuardStatus | null>(null)
  async function getStatus() {
    const result = await window.ipcInvoke.getWireGuardStatus()
    status.value = result ? JSON.parse(result) : null
    // console.log('Status fetched:', status.value)
  }
  async function syncStatus() {
    await getStatus()
    setIsWgRunning(!!status.value)
    setCurrentClient(clients.value.find((c) => c.name === status.value?.interface.name) || null)
  }

  // clients part
  const clients = ref<WireGuardClient[]>([])
  const clientKeepAliveMap: Map<string, boolean> = new Map()
  let clientKeepAliveInterval: number
  watch(
    clients,
    (list) => {
      if (list.length) {
        clientKeepAliveInterval = list[0].config.peer.persistentKeepalive * 1000
        setInterval(() => {
          clients.value.forEach((c) => {
            if (c.id !== currentClient.value?.id) {
              clientKeepAliveMap[c.id] = false
            }
          })
        }, clientKeepAliveInterval)
      }
    },
    {
      once: true
    }
  )
  async function getClients() {
    const result = await window.api.getClientsWithConfig()
    if (result.length) {
      clients.value = result
        .filter((r) => r.enabled)
        .map((r) => {
          if (r.transferRxDiff) {
            clientKeepAliveMap[r.id] = true
          }
          return {
            ...r,
            isKeepAlive: clientKeepAliveMap[r.id]
          }
        })
    }
    return clients.value
  }
  async function syncClients() {
    await getClients()
    const isSuccess = await window.ipcInvoke.syncWireGuardConfigs()
    return isSuccess
  }

  return {
    currentClient,
    setCurrentClient,
    isWgRunning,
    setIsWgRunning,
    clients,
    getClients,
    syncClients,
    status,
    getStatus,
    syncStatus
  }
})
