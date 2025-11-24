<script setup lang="ts">
import { NButton } from 'naive-ui'
import { useGlobalStore } from '@renderer/stores/global'

const globalStore = useGlobalStore()
</script>

<template>
  <div class="flex items-center gap2 relative">
    <NButton
      :type="globalStore.currentModule === 'client' ? 'primary' : 'default'"
      @click="globalStore.currentModule = 'client'"
    >
      Client
    </NButton>
    <!-- <NDivider vertical /> -->
    <NButton
      :type="globalStore.currentModule === 'file' ? 'primary' : 'default'"
      @click="globalStore.currentModule = 'file'"
    >
      File
    </NButton>
  </div>
</template>
