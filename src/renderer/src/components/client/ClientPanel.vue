<!-- eslint-disable @typescript-eslint/explicit-function-return-type -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useWgStore } from '@renderer/stores/wg'
import ClientCard from './ClientCard.vue'
import { WireGuardClient, WireGuardCode } from '@shared/types'
import { delay } from '@shared/utils'
import { NButton, NDivider, useMessage, NScrollbar } from 'naive-ui'
import { CloudSyncRound as SyncIcon, SpeedRound as SpeedIcon } from '@vicons/material'
import { useSettingStore } from '@renderer/stores/setting'

const message = useMessage()
const wgStore = useWgStore()
const settingStore = useSettingStore()
const isLoading = ref(false)
const isSyncLoading = ref(false)
const isSpeeding = ref(false)
const delayMap = ref<Record<string, string | undefined>>({})

// startup time statistics
const startupTime = ref({
  d: 0,
  h: 0,
  m: 0,
  s: 0
})
setInterval(() => {
  startupTime.value.s++
  if (startupTime.value.s === 60) {
    startupTime.value.s = 0
    startupTime.value.m++
  }
  if (startupTime.value.m === 60) {
    startupTime.value.m = 0
    startupTime.value.h++
  }
  if (startupTime.value.h === 24) {
    startupTime.value.h = 0
    startupTime.value.d++
  }
}, 1000)
const startupTimeDisplay = computed(() => {
  return `${startupTime.value.d}:${startupTime.value.h}:${startupTime.value.m}:${startupTime.value.s}`
})

//#region interval auto sync clients
let interval
watch(
  () => settingStore.setting?.autoSync,
  () => {
    clearInterval(interval)
    isSyncLoading.value = false
    if (!settingStore.setting?.autoSync.enable) return
    interval = setInterval(async () => {
      isSyncLoading.value = true
      await wgStore.syncClients()
    }, settingStore.setting?.autoSync.interval)
  },
  {
    immediate: true
  }
)
//#endregion

//#region statistical number of states
const idelClients = computed(() => {
  return wgStore.clients.filter((c) => !c.isKeepAlive && c.id !== wgStore.currentClient?.id)
})
const keepAliveClients = computed(() => {
  return wgStore.clients.filter((c) => c.isKeepAlive)
})
//#endregion

//#region action bar handlers
async function handleSync() {
  isSyncLoading.value = true
  await delay(1000)
  await wgStore.syncClients()
  await wgStore.syncStatus()
  isSyncLoading.value = false
  message.success(`Sync from ${settingStore.setting?.url}.`)
}

async function handleSpeed() {
  isSpeeding.value = true
  for (const client of wgStore.clients) {
    if (client.isKeepAlive) {
      delayMap.value[client.id] = await window.ipcInvoke.ping(client.address)
    } else {
      delayMap.value[client.id] = void 0
    }
  }
  isSpeeding.value = false
}
//#endregion

//#region card emit handlers
function finishToggle() {
  isLoading.value = false
  message.success(`${wgStore.isWgRunning ? 'Started' : 'Stopped'} successfully!`)
}
async function handleToggle(client: WireGuardClient, name: string) {
  let code: WireGuardCode
  isLoading.value = true
  wgStore.setCurrentClient(client)
  await delay(1000) // Prevent too fast toggling

  if (wgStore.isWgRunning) {
    if (wgStore.currentClient && wgStore.currentClient.id !== client.id) {
      // Switch client:
      // Stop current client first
      code = await window.ipcInvoke.stopWireGuard(wgStore.currentClient.name)
      if (code !== 0) {
        finishToggle()
        return
      }
      await delay(1000) // Wait for a while
      // Then start new client
      code = await window.ipcInvoke.startWireGuard(name)
      wgStore.setCurrentClient(client)
      finishToggle()
      return
    } else {
      code = await window.ipcInvoke.stopWireGuard(name)
    }
  } else {
    code = await window.ipcInvoke.startWireGuard(name)
  }
  if (code === 0) {
    wgStore.setIsWgRunning(!wgStore.isWgRunning)
    wgStore.isWgRunning ? wgStore.setCurrentClient(client) : wgStore.setCurrentClient(null)
  }
  finishToggle()
}
function handleGetStatus() {
  window.ipcInvoke.getWireGuardStatus()
}
//#endregion
</script>

<template>
  <main class="py-2">
    <div class="flex items-center px-4">
      <h2 class="text-2xl p-4">{{ startupTimeDisplay }}</h2>
      <div class="ml-auto flex gap-2 mr-6">
        <NButton size="small" type="info" :loading="isSyncLoading" @click="handleSync">
          <template #icon>
            <SyncIcon />
          </template>
        </NButton>
        <NButton size="small" type="info" :loading="isSpeeding" @click="handleSpeed">
          <template #icon>
            <SpeedIcon />
          </template>
        </NButton>
      </div>
    </div>
    <NDivider style="margin-block: 5px">
      <div class="flex items-center text-sm">
        <span class="text-green-600">Current</span>
        <NDivider vertical style="height: 10px" />
        <span class="text-blue">Idle: {{ idelClients.length }}</span>
        <NDivider vertical style="height: 10px" />
        <span class="text-yellow">KeepAlive: {{ keepAliveClients.length }}</span>
      </div>
    </NDivider>
    <NScrollbar style="height: 350px" class="flex flex-col gap-5 pb-4">
      <template v-for="client in wgStore.clients" :key="client.id">
        <ClientCard
          :client="client"
          :is-loading="isLoading"
          :is-wg-running="wgStore.isWgRunning"
          :is-current="wgStore.currentClient?.id === client.id"
          :delay="delayMap[client.id]"
          @toggle="(name) => handleToggle(client, name)"
          @get-status="handleGetStatus"
        />
        <NDivider style="margin-block: 0px" />
      </template>
    </NScrollbar>
  </main>
</template>
