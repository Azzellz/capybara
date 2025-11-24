<template>
  <NCard class="w-auto">
    <div class="flex items-center">
      <h2>{{ client.name }}</h2>
      <div class="ml-auto flex gap-2">
        <NButton size="small" @click="emit('copy', client.configStr)">
          <template #icon>
            <CopyIcon />
          </template>
        </NButton>
      </div>
    </div>
    <NDivider style="margin-top: 8px; margin-bottom: 0px" />
    <pre>{{ client.configStr }}</pre>
  </NCard>
</template>

<script setup lang="ts">
import type { WireGuardClient } from '@shared/types'
import { NCard, NDivider, NButton } from 'naive-ui'
import { ContentCopyRound as CopyIcon } from '@vicons/material'

defineProps<{
  client: WireGuardClient
}>()
const emit = defineEmits<{
  copy: [content: string]
}>()
</script>
