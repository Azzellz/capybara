<template>
  <div class="px-2">
    <div class="flex items-center gap-2">
      <span :class="titleStyle">{{ client.name }}</span>
      <NButton text style="font-size: 20px" @click="isExpand = !isExpand">
        <NIcon>
          <ExpandMoreIcon
            :style="{
              transform: isExpand ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }"
          />
        </NIcon>
      </NButton>
      <div class="flex items-center gap-2 ml-auto text-sm">
        <NInput
          v-model:value="path"
          size="small"
          class="items-center"
          style="max-width: 250px"
          placeholder="C:\Program Files"
          clearable
        >
          <template #prefix>
            <span class="text-gray"> Source: </span>
          </template>
        </NInput>
        <NInputNumber
          v-model:value="port"
          size="small"
          class="items-center"
          style="max-width: 175px"
          :min="1024"
          :max="65535"
          :default-value="3000"
          placeholder="..."
        >
          <template #prefix> <span class="text-gray"> Port: </span> </template>
        </NInputNumber>
        <NButton size="small" type="primary" :disabled="!isAllowGet" @click="handleGet">
          <NIcon>
            <GetIcon />
          </NIcon>
        </NButton>
        <NButton
          size="small"
          type="info"
          :disabled="selectedFileList.length === 0"
          @click="handleSync"
        >
          <NIcon>
            <SyncIcon />
          </NIcon>
        </NButton>
        <NButton
          size="small"
          type="warning"
          :disabled="fileList.length === 0"
          @click="handleSelectAll"
        >
          {{ selectedFileList.length === fileList.length ? 'UnAll' : 'All' }}
        </NButton>
        <NButton
          size="small"
          type="error"
          :disabled="fileList.length === 0"
          @click="handleResetFiles"
        >
          Reset
        </NButton>
      </div>
    </div>
    <!-- File Tree -->
    <div v-if="isExpand" class="mt-5 flex flex-col gap-2">
      <FileTree
        v-model:selected-files="selectedFileList"
        :files="fileList"
        :status-getter="(path) => statusMap.get(client.id + path)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { QueryFileListResponse, WireGuardClient } from '@shared/types'
import type { ClientFile, FileSyncStatus } from '@shared/types/client'
import axios, { type AxiosResponse } from 'axios'
import { NButton, NInputNumber, NInput, NIcon, useMessage } from 'naive-ui'
import { computed, ref } from 'vue'
import {
  ExpandMoreRound as ExpandMoreIcon,
  SearchRound as GetIcon,
  CloudSyncRound as SyncIcon
} from '@vicons/material'
import FileTree from './FileTree.vue'

const props = defineProps<{
  client: WireGuardClient
  isCurrent: boolean
  statusMap: Map<string, FileSyncStatus>
}>()

const emits = defineEmits<{
  (e: 'sync', baseURL: string, sourcePath: string, files: ClientFile[]): void
  (e: 'reset-status'): void
}>()

const message = useMessage()

const path = ref('')
const port = ref(3000)
const isExpand = ref(false)
const fileList = ref<ClientFile[]>([])
const selectedFileList = ref<ClientFile[]>([])

const isAllowGet = computed(() => {
  const isValidPort = port.value >= 1024 && port.value <= 65535
  const isValidPath = !!path.value
  return isValidPort && isValidPath
})
const baseURL = computed(() => {
  return `http://${props.client.address}:${port.value}/file`
})
const titleStyle = computed(() => {
  const base = 'text-2xl font-bold'
  if (props.isCurrent) {
    return base + ' text-green-600 '
  } else if (props.client.isKeepAlive) {
    return base + ' text-yellow'
  } else {
    return base + ' text-blue'
  }
})

async function handleGet(): Promise<void> {
  const encodedPath = encodeURIComponent(path.value.replace(/\\/g, '/'))
  const url = `${baseURL.value}/list/${encodedPath}`
  const result: AxiosResponse<QueryFileListResponse> = await axios.get(url)
  if (result.data.list) {
    fileList.value = result.data.list
    isExpand.value = true
    message.success('File list retrieved successfully')
  }
}

function handleSync(): void {
  emits('sync', baseURL.value, path.value, selectedFileList.value)
}

function handleSelectAll(): void {
  if (selectedFileList.value === fileList.value) {
    selectedFileList.value = []
  } else {
    selectedFileList.value = fileList.value
  }
  emits('reset-status')
}
function handleResetFiles(): void {
  emits('reset-status')
  fileList.value = []
  selectedFileList.value = []
}
</script>
