<!-- eslint-disable vue/block-lang -->
<template>
  <div class="p-5 flex gap-2 rounded-md border border-gray-300">
    <div>
      <div class="flex items-center gap-2">
        <h2 :class="titleStyle">{{ client.name }}</h2>
      </div>
      <div class="flex items-center mt-1">
        <div>{{ client.address }}</div>
        <NDivider vertical />
        <div>{{ formatRelativeTime(client.latestHandshakeAt!) }}</div>
        <NDivider vertical />
        <div>
          ↓ {{ formatBytes(client.transferRx) }}
          {{ client.transferRxDiff ? ` + ${formatBytes(client.transferRxDiff)}` : '' }}
        </div>
        <div class="ml-2">
          ↑ {{ formatBytes(client.transferTx) }}
          {{ client.transferTxDiff ? ` + ${formatBytes(client.transferTxDiff)}` : '' }}
        </div>
        <template v-if="delay">
          <NDivider vertical />
          <div class="ml-2" :class="delayStyle">{{ delayDisplay }}</div>
        </template>
      </div>
    </div>

    <div class="flex gap-2 items-center ml-auto">
      <NButton
        v-if="!isWgRunning || !isCurrent"
        size="small"
        type="primary"
        :loading="isLoading"
        :disabled="isDisabled"
        @click="emits('toggle', client.name)"
      >
        <template #icon>
          <StartIcon />
        </template>
      </NButton>
      <NButton
        v-else
        size="small"
        type="error"
        :loading="isLoading"
        :disabled="isDisabled"
        @click="emits('toggle', client.name)"
      >
        <template #icon>
          <StopIcon />
        </template>
      </NButton>
      <NButton size="small" @click="handleCopy(client.address)">
        <template #icon>
          <CopyIcon />
        </template>
      </NButton>
      <NButton size="small" @click="handleOpenDetail">
        <template #icon>
          <DetailsIcon />
        </template>
      </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WireGuardClient } from '@shared/types'
import { formatRelativeTime } from '@renderer/utils'
import { NButton, NDivider, useMessage, useModal } from 'naive-ui'
import {
  PlayArrowRound as StartIcon,
  ContentCopyRound as CopyIcon,
  CodeRound as DetailsIcon,
  StopRound as StopIcon
} from '@vicons/material'
import { computed, h } from 'vue'
import ClientDetail from './ClientDetail.vue'
import { formatBytes } from '@shared/utils'

const message = useMessage()
const modal = useModal()
const props = defineProps<{
  client: WireGuardClient
  isCurrent: boolean
  isWgRunning: boolean
  isLoading: boolean
  delay?: string
}>()
const emits = defineEmits<{
  toggle: [name: string]
  getStatus: []
}>()
const isDisabled = computed(() => {
  if (props.isLoading && !props.isCurrent) {
    return true
  } else if (props.client.isKeepAlive && !props.isCurrent) {
    return true
  }
  return false
})
const isLoading = computed(() => {
  if (props.isLoading && props.isCurrent) {
    return true
  }
  return false
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
const delayStyle = computed(() => {
  if (!props.delay) return ''
  if (parseInt(props.delay) <= 90) {
    return 'text-green-600'
  } else if (parseInt(props.delay) <= 200) {
    return 'text-yellow'
  } else {
    return 'text-red'
  }
})
const delayDisplay = computed(() => {
  if (props.delay === 'unknown') {
    return 'timeout'
  } else {
    return parseInt(props.delay!) + 'ms'
  }
})

async function handleCopy(content: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(content)
    message.success('Copied to clipboard!')
  } catch (error) {
    message.error('Failed to copy to clipboard.' + error)
  }
}

async function handleOpenDetail(): Promise<void> {
  modal.create({
    render() {
      return h(ClientDetail, {
        client: props.client,
        onCopy: handleCopy
      })
    }
  })
}
</script>
