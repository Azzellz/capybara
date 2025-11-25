/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
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
  const getIsCurrent = (client: WireGuardClient) => {
    return currentClient.value?.id === client.id
  }

  // running part
  const isWgRunning = ref(false)
  const setIsWgRunning = (running: boolean) => {
    isWgRunning.value = running
  }

  // delay part
  const delayMap = ref<Record<string, string | undefined>>({})

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

  // sync part
  async function sync() {
    await syncClients()
    await syncStatus()
  }

  // clients part
  const clients = ref<WireGuardClient[]>([])
  const keepAliveClients = computed(() => {
    return clients.value.filter((c) => c.isKeepAlive)
  })
  const availableClients = computed(() => {
    return clients.value.filter((c) => c.isKeepAlive || c.id === currentClient.value?.id)
  })
  const idleClients = computed(() => {
    return clients.value.filter((c) => !c.isKeepAlive && c.id !== currentClient.value?.id)
  })
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
  }

  return {
    currentClient,
    setCurrentClient,
    getIsCurrent,
    isWgRunning,
    setIsWgRunning,
    clients,
    getClients,
    syncClients,
    status,
    getStatus,
    syncStatus,
    sync,
    delayMap,
    keepAliveClients,
    idleClients,
    availableClients
  }
})
