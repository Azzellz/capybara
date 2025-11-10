<template>
  <NConfigProvider abstract :theme="theme">
    <NMessageProvider>
      <NModalProvider>
        <NCard class="h-full">
          <main v-if="isReady" class="h-full flex flex-col gap-5 animate__animated animate__fadeIn">
            <slot />
          </main>
          <div v-else class="h-full flex text-30px animate__animated animate__fadeOut">
            <div class="m-auto">Loading...</div>
          </div>
        </NCard>
      </NModalProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import {
  NMessageProvider,
  NModalProvider,
  NConfigProvider,
  darkTheme,
  lightTheme,
  useOsTheme,
  NCard
} from 'naive-ui'
import { useSettingStore } from '@renderer/stores/setting'
import { ref, onBeforeMount, computed } from 'vue'
import { useWgStore } from '@renderer/stores/wg'

const isReady = ref(false)
const wgStore = useWgStore()
const settingStore = useSettingStore()

const osTheme = useOsTheme()
const theme = computed(() => {
  if (settingStore.setting?.theme === 'light') {
    return lightTheme
  } else if (settingStore.setting?.theme === 'dark') {
    return darkTheme
  } else {
    return osTheme.value === 'dark' ? darkTheme : lightTheme
  }
})

onBeforeMount(async () => {
  await settingStore.getSetting()
  await wgStore.getClients()
  await wgStore.syncStatus()
  isReady.value = true
})
</script>
