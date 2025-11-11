<template>
  <NCard class="min-w-1/2 w-auto">
    <div class="flex items-center">
      <div>
        <h2>Config</h2>
        <div v-if="isInit" class="text-gray text-sm">
          Complete your initial configuration and click the save button on the right
        </div>
      </div>
      <div class="ml-auto flex gap-2">
        <NButton text :loading="isLoading" type="warning" @click="handleValidate">
          <template #icon>
            <NIcon size="26">
              <SaveIcon />
            </NIcon>
          </template>
        </NButton>
      </div>
    </div>
    <NDivider style="margin-top: 8px; margin-bottom: 16px" />
    <div class="flex flex-col gap-5">
      <NInputGroup>
        <NInputGroupLabel>URL</NInputGroupLabel>
        <NInput v-model:value="setting.url" />
      </NInputGroup>
      <NInputGroup v-if="setting.password.enable">
        <NInputGroupLabel>PASSWORD</NInputGroupLabel>
        <NInput v-model:value="setting.password.value" />
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
import { cloneDeep } from 'lodash'

const { onSaved } = defineProps<{
  isInit?: boolean
  onSaved?: () => void
}>()
const isLoading = ref(false)
const modal = useModal()
const message = useMessage()
const settingStore = useSettingStore()
const setting = ref<Config>(cloneDeep(settingStore.setting)!)

async function handleSaveSetting(): Promise<void> {
  isLoading.value = true
  const err = await settingStore.saveSetting(cloneDeep(setting.value))
  if (err) {
    message.error(err)
  } else {
    message.success('Save successfully.')
    modal.destroyAll()
  }
  isLoading.value = false
}

async function handleValidate(): Promise<void> {
  isLoading.value = true
  if (!isValidURL(setting.value.url)) {
    message.error('URL is invalid.')
  } else if (setting.value.password.enable && setting.value.password.value === '') {
    message.error('Password is required.')
  } else {
    const isValid = await window.api.initSession(JSON.stringify(setting.value))
    if (isValid) {
      settingStore.setIsValid(true)
      await handleSaveSetting()
      onSaved?.()
    } else {
      settingStore.setIsValid(false)
      message.error('Unable to complete authentication, please check URL and PASSWORD.')
    }
  }
  isLoading.value = false
}
</script>
