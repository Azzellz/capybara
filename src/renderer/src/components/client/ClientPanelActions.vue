<!-- eslint-disable @typescript-eslint/explicit-function-return-type -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useWgStore } from '@renderer/stores/wg'
import { NButton, useMessage } from 'naive-ui'
import {
  CloudSyncRound as SyncIcon,
  SpeedRound as SpeedIcon,
  CloudDownloadRound as DownloadIcon
} from '@vicons/material'
import { useSettingStore } from '@renderer/stores/setting'

const message = useMessage()
const wgStore = useWgStore()
const settingStore = useSettingStore()
const isSyncLoading = ref(false)
const isSpeeding = ref(false)
const isDownloading = ref(false)

//#region startup time statistics
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
//#endregion

//#region interval auto sync clients
let interval
watch(
  () => settingStore.setting?.autoSync,
  (newVal, oldVal) => {
    if (newVal?.enable === oldVal?.enable) return
    clearInterval(interval)
    isSyncLoading.value = false
    if (!settingStore.setting?.autoSync.enable) return
    // If interval is not set, sync once
    if (!interval) {
      isSyncLoading.value = true
      wgStore.sync()
    }
    interval = setInterval(() => {
      isSyncLoading.value = true
      wgStore.sync()
    }, settingStore.setting?.autoSync.interval)
  },
  {
    immediate: true
  }
)
//#endregion

//#region action bar handlers
async function handleSync() {
  isSyncLoading.value = true
  await wgStore.syncClients()
  await wgStore.syncStatus()
  isSyncLoading.value = false
  message.success(`Sync from ${settingStore.setting?.url}.`)
}

async function handleSpeed() {
  isSpeeding.value = true
  for (const client of wgStore.clients) {
    if (client.isKeepAlive || wgStore.currentClient?.id === client.id) {
      wgStore.delayMap[client.id] = await window.ipcInvoke.ping(client.address)
    } else {
      wgStore.delayMap[client.id] = void 0
    }
  }
  isSpeeding.value = false
  message.success(`Speed test completed.`)
}

async function handleDownload() {
  isDownloading.value = true
  await window.ipcInvoke.downloadWireGuardConfigs()
  isDownloading.value = false
  message.success(`Downloaded WireGuard configs from ${settingStore.setting?.url}.`)
}
//#endregion
</script>

<template>
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
      <NButton size="small" type="info" :loading="isDownloading" @click="handleDownload">
        <template #icon>
          <DownloadIcon />
        </template>
      </NButton>
    </div>
  </div>
</template>
