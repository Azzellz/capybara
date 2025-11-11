<script setup lang="ts">
import {
  NMessageProvider,
  NModalProvider,
  NConfigProvider,
  darkTheme,
  lightTheme,
  useOsTheme
} from 'naive-ui'
import { useSettingStore } from '@renderer/stores/setting'
import { computed } from 'vue'

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
</script>

<template>
  <NConfigProvider abstract :theme="theme">
    <NMessageProvider>
      <NModalProvider>
        <slot />
      </NModalProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
