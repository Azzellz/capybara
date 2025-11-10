<template>
  <NCard class="min-w-1/2 w-auto">
    <div class="flex items-center">
      <h2>Config</h2>
      <div class="ml-auto flex gap-2">
        <NButton text type="warning" style="font-size: 26px" @click="handleSaveSetting">
          <NIcon>
            <SaveIcon />
          </NIcon>
        </NButton>
      </div>
    </div>
    <NDivider style="margin-top: 8px; margin-bottom: 16px" />
    <div class="flex flex-col gap-5">
      <NInputGroup>
        <NInputGroupLabel>URL</NInputGroupLabel>
        <NInput v-model:value="setting.url" :allow-input="(url) => isValidURL(url)" />
      </NInputGroup>
      <NInputGroup>
        <NInputGroupLabel>Title</NInputGroupLabel>
        <NInput v-model:value="setting.title" />
      </NInputGroup>
      <NInputGroup>
        <NInputGroupLabel>Subtitle</NInputGroupLabel>
        <NInput v-model:value="setting.subtitle" type="textarea" />
      </NInputGroup>
      <NInputGroup>
        <NButton
          v-if="setting.autoSync.enable"
          type="primary"
          @click="setting.autoSync.enable = false"
        >
          AutoSync
        </NButton>
        <NButton v-else type="error" @click="setting.autoSync.enable = true"> AutoSync </NButton>
        <NInputNumber
          v-model:value="setting.autoSync.interval"
          :disabled="!setting.autoSync.enable"
          placeholder=".."
          min="1000"
          style="width: 125px"
        >
          <template #suffix> ms </template>
        </NInputNumber>
      </NInputGroup>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import {
  NCard,
  NDivider,
  NButton,
  NInput,
  NInputNumber,
  NInputGroup,
  NInputGroupLabel,
  useModal,
  useMessage,
  NIcon
} from 'naive-ui'
import { SaveRound as SaveIcon } from '@vicons/material'
import { useSettingStore } from '@renderer/stores/setting'
import { ref } from 'vue'
import type { Config } from '@shared/types'
import { isValidURL } from '@shared/utils'

const modal = useModal()
const message = useMessage()
const settingStore = useSettingStore()
const setting = ref<Config>(JSON.parse(JSON.stringify(settingStore.setting)))

async function handleSaveSetting(): Promise<void> {
  const err = await settingStore.saveSetting(JSON.parse(JSON.stringify(setting.value)))
  if (err) {
    message.error(err)
  } else {
    message.success('Save successfully.')
    modal.destroyAll()
  }
}
</script>
