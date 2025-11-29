<!-- eslint-disable @typescript-eslint/explicit-function-return-type -->
<script setup lang="ts">
import { useWgStore } from '@renderer/stores/wg'
import { ref } from 'vue'
import ClientLine from './ClientLine.vue'
import { WireGuardClient } from '@shared/types'
import { sleep } from '@shared/utils'
import { NDivider, useMessage, NScrollbar } from 'naive-ui'

const message = useMessage()
const wgStore = useWgStore()
const isLoading = ref(false)

function finishToggle() {
  isLoading.value = false
  message.success(`${wgStore.isWgRunning ? 'Started' : 'Stopped'} successfully!`)
}
async function handleStart(client: WireGuardClient) {
  // Switch client if current client is not the same
  if (wgStore.currentClient && !wgStore.getIsCurrent(client)) {
    await handleStop(wgStore.currentClient)
  }
  isLoading.value = true
  await sleep(1000)
  const code = await window.ipcInvoke.startWireGuard(client.name)
  if (code === 0) {
    wgStore.setIsWgRunning(true)
    wgStore.setCurrentClient(client)
  }
  finishToggle()
}
async function handleStop(client: WireGuardClient) {
  isLoading.value = true
  const code = await window.ipcInvoke.stopWireGuard(client.name)
  if (code === 0) {
    wgStore.setIsWgRunning(false)
    wgStore.setCurrentClient(null)
  }
  finishToggle()
}
</script>

<template>
  <NScrollbar style="height: 320px" class="flex flex-col gap-5 pb-4">
    <template v-for="client in wgStore.clients" :key="client.id">
      <ClientLine
        :client="client"
        :is-loading="isLoading"
        :is-wg-running="wgStore.isWgRunning"
        :is-current="wgStore.getIsCurrent(client)"
        :delay="wgStore.delayMap[client.id]"
        @start="(client) => handleStart(client)"
        @stop="(client) => handleStop(client)"
      />
      <NDivider style="margin-block: 0px" />
    </template>
  </NScrollbar>
</template>
