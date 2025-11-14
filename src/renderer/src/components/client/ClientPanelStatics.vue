<script setup lang="ts">
import { computed } from 'vue'
import { useWgStore } from '@renderer/stores/wg'
import { NDivider } from 'naive-ui'

const wgStore = useWgStore()

//#region statistical number of states
const idelClients = computed(() => {
  return wgStore.clients.filter((c) => !c.isKeepAlive && c.id !== wgStore.currentClient?.id)
})
const keepAliveClients = computed(() => {
  return wgStore.clients.filter((c) => c.isKeepAlive && c.id !== wgStore.currentClient?.id)
})
//#endregion
</script>

<template>
  <NDivider style="margin-block: 5px">
    <div class="flex items-center text-sm">
      <span class="text-green-600">Current: {{ wgStore.currentClient ? 1 : 0 }}</span>
      <NDivider vertical style="height: 10px" />
      <span class="text-blue">Idle: {{ idelClients.length }}</span>
      <NDivider vertical style="height: 10px" />
      <span class="text-yellow">KeepAlive: {{ keepAliveClients.length }}</span>
    </div>
  </NDivider>
</template>
