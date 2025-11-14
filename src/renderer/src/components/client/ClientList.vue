<!-- eslint-disable @typescript-eslint/explicit-function-return-type -->
<script setup lang="ts">
import { useWgStore } from '@renderer/stores/wg'
import { ref } from 'vue'
import ClientLine from './ClientLine.vue'
import { WireGuardClient, WireGuardCode } from '@shared/types'
import { delay } from '@shared/utils'
import { NDivider, useMessage, NScrollbar } from 'naive-ui'

const message = useMessage()
const wgStore = useWgStore()
const isLoading = ref(false)

const delayMap = ref<Record<string, string | undefined>>({})

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
  <NScrollbar style="height: 350px" class="flex flex-col gap-5 pb-4">
    <template v-for="client in wgStore.clients" :key="client.id">
      <ClientLine
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
</template>
