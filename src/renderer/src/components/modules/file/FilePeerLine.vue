<template>
  <div class="px-4">
    <div class="flex">
      <h2>{{ client.name }}</h2>
      <div class="flex gap-2 ml-auto">
        <NInput v-model:value="path" placeholder="C:\Program Files" clearable>
          <template #prefix>
            <span class="text-gray"> Path: </span>
          </template>
        </NInput>
        <NInputNumber
          v-model:value="port"
          style="max-width: 150px"
          :min="1024"
          :max="65535"
          :default-value="3000"
          placeholder="..."
        >
          <template #prefix> <span class="text-gray"> Port: </span> </template>
        </NInputNumber>
        <NButton type="primary" :disabled="!isAllowGet" @click="handleGet"> Get </NButton>
        <NButton type="info" :disabled="fileList.length === 0" @click="handleSync"> Sync </NButton>
      </div>
    </div>
    <div class="mt-5 flex flex-col gap-2">
      <div v-for="(file, index) in fileList" :key="index" class="flex">
        <div>{{ file.path }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QueryFileListResponse, WireGuardClient } from '@shared/types'
import type { ClientFile } from '@shared/types/client'
import axios, { AxiosResponse } from 'axios'
import { NButton, NInputNumber, NInput } from 'naive-ui'
import { computed, ref } from 'vue'

const props = defineProps<{
  client: WireGuardClient
}>()
const path = ref('')
const port = ref(3000)
const isAllowGet = computed(() => {
  const isValidPort = port.value >= 1024 && port.value <= 65535
  const isValidPath = !!path.value
  return isValidPort && isValidPath
})
const fileList = ref<ClientFile[]>([])
async function handleGet(): Promise<void> {
  const encodedPath = encodeURIComponent(path.value.replace(/\\/g, '/'))
  const url = `//${props.client.address}:${port.value}/file/list/${encodedPath}`
  const result: AxiosResponse<QueryFileListResponse> = await axios.get(url)
  if (result.data.list) {
    fileList.value = result.data.list
    console.log(fileList.value)
  }
}
async function handleSync(): Promise<void> {
  console.log(123)
}
</script>
