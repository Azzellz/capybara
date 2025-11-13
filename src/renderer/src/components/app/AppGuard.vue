<template>
  <NCard class="h-full">
    <main v-if="isReady" class="h-full flex flex-col gap-5 animate__animated animate__fadeIn">
      <slot />
    </main>
    <div v-else-if="isGetSetting && isNotConfig" class="mt-100px px-10">
      <SettingPanel :is-init="true" @saved="handleSaved" />
    </div>
    <div v-else class="h-full flex text-30px animate__animated animate__fadeIn">
      <div class="m-auto">Loading...</div>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { NCard, useMessage } from 'naive-ui'
import { useSettingStore } from '@renderer/stores/setting'
import { ref, onBeforeMount } from 'vue'
import { useWgStore } from '@renderer/stores/wg'
import SettingPanel from '../setting/SettingPanel.vue'

const isReady = ref(false)
const isGetSetting = ref(false)
const isNotConfig = ref(false)
const wgStore = useWgStore()
const message = useMessage()
const settingStore = useSettingStore()

async function handleInit(): Promise<void> {
  await wgStore.getClients()
  await wgStore.syncClients()
  isReady.value = true
  isNotConfig.value = false
}

function handleSaved(): void {
  if (settingStore.isValid) {
    handleInit()
  }
}

onBeforeMount(async () => {
  // config check
  const config = await settingStore.getSetting()
  isGetSetting.value = true
  if (settingStore.isEmpty) {
    isNotConfig.value = true
  } else {
    isNotConfig.value = false
    const isValid = await window.api.initSession(JSON.stringify(config))
    if (isValid) {
      await handleInit()
    } else {
      isReady.value = false
      isNotConfig.value = true
      message.error('Unable to complete authentication, please check URL and PASSWORD.')
    }
  }
})
</script>
