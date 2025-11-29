<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { useGlobalStore } from '@renderer/stores/global'
import {
  AccountCircleRound as ClientIcon,
  DriveFileMoveOutlined as FileIcon
} from '@vicons/material'
const globalStore = useGlobalStore()
</script>

<template>
  <div class="flex items-center gap-3">
    <NButton
      text
      style="font-size: 28px"
      :type="globalStore.currentModule === 'client' ? 'primary' : 'default'"
      @click="globalStore.currentModule = 'client'"
    >
      <NIcon>
        <ClientIcon />
      </NIcon>
    </NButton>
    <NButton
      text
      style="font-size: 32px"
      :type="globalStore.currentModule === 'file' ? 'primary' : 'default'"
      @click="globalStore.currentModule = 'file'"
    >
      <NIcon>
        <FileIcon />
      </NIcon>
    </NButton>
  </div>
</template>
