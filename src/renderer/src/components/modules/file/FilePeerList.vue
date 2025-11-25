<template>
  <NScrollbar style="height: 350px" class="flex flex-col gap-5 pb-4">
    <template v-for="client in wgStore.clients" :key="client.id">
      <FilePeerItem
        class="mx-4"
        :client="client"
        :is-current="wgStore.getIsCurrent(client)"
        :status-map="syncStatusRecordMap"
        @sync="(baseURL, sourcePath, fileList) => handleSync(client, sourcePath, baseURL, fileList)"
        @reset-status="handleResetStatusMap"
      />
      <NDivider />
    </template>
  </NScrollbar>
</template>

<script setup lang="ts">
import { useWgStore } from '@renderer/stores/wg'
import FilePeerItem from './FilePeerItem.vue'
import { NDivider, NScrollbar, useMessage } from 'naive-ui'
import type { ClientFile, FileSyncStatus, WireGuardClient } from '@shared/types'
import axios from 'axios'
import { ref } from 'vue'

const props = defineProps<{
  targetPath: string
}>()

const wgStore = useWgStore()
const message = useMessage()

const syncStatusRecordMap = ref<Map<string, FileSyncStatus>>(new Map())
function flattenFileTree(files: ClientFile[]): ClientFile[] {
  const result: ClientFile[] = []
  for (const file of files) {
    result.push(file)
    if (file.isDir && file.children && file.children.length > 0) {
      result.push(...flattenFileTree(file.children))
    }
  }
  return result
}
async function handleSync(
  client: WireGuardClient,
  sourcePath: string,
  baseURL: string,
  fileList: ClientFile[]
): Promise<void> {
  // reset status map
  syncStatusRecordMap.value = new Map()

  const startAt = Date.now()
  const targetPath = props.targetPath
  const allFiles = flattenFileTree(fileList)
  allFiles.forEach((file) => {
    syncStatusRecordMap.value.set(client.id + file.path, 'waiting')
  })

  for (const file of allFiles) {
    const key = client.id + file.path
    if (file.isDir) {
      syncStatusRecordMap.value.set(key, 'completed')
      continue
    }

    syncStatusRecordMap.value.set(key, 'downloading')
    const downloadResult = await axios.post(
      `${baseURL}/download`,
      {
        path: file.path
      },
      {
        responseType: 'arraybuffer'
      }
    )
    if (downloadResult.status !== 200) {
      syncStatusRecordMap.value.set(key, 'failed')
      continue
    }

    syncStatusRecordMap.value.set(key, 'uploading')
    const blob = new Blob([downloadResult.data], { type: 'application/octet-stream' })
    const form = new FormData()
    form.append('file', blob, file.name || 'file')
    // Reconstruct the relative path
    const trunks = file.path.replace(sourcePath, '').split('\\')
    trunks.pop()
    const relativePath = trunks.join('\\')
    form.append('path', targetPath + relativePath)
    form.append('overwrite', 'true')
    const uploadResult = await axios.postForm(
      `//${wgStore.currentClient?.address}:3000/file/upload`,
      form
    )
    if (uploadResult.status !== 200) {
      syncStatusRecordMap.value.set(key, 'failed')
      continue
    }

    syncStatusRecordMap.value.set(key, 'completed')
  }

  const endAt = Date.now()
  message.success(`Sync completed in ${endAt - startAt} ms`)
}
function handleResetStatusMap(): void {
  syncStatusRecordMap.value = new Map()
}
</script>
