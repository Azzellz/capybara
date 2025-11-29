<template>
  <NCard class="shadow-[2px_2px_2px_2px_#333] px-6 pt-6 pb-4" content-style="padding: 0px">
    <div class="flex items-center">
      <div class="ml-2">
        <div class="flex items-center">
          <img
            v-if="settingStore.setting?.logo"
            :src="settingStore.setting.logo"
            alt="Logo"
            class="w-12 h-12"
          />
          <h1>{{ settingStore.setting?.title }}</h1>
        </div>
        <div class="text-gray">{{ settingStore.setting?.subtitle }}</div>
      </div>
      <div class="ml-auto flex gap-7 mr-9">
        <NButton text style="font-size: 20px" @click="handleOpenSetting">
          <NIcon>
            <SettingIcon style="font-size: 30px" />
          </NIcon>
        </NButton>
        <NButton text style="font-size: 20px" @click="handleOpenQA">
          <NIcon>
            <QAIcon style="font-size: 30px" />
          </NIcon>
        </NButton>
        <NButton text style="font-size: 20px" @click="handleSwitchTheme">
          <NIcon>
            <ThemeIcon style="font-size: 30px" />
          </NIcon>
        </NButton>
      </div>
    </div>
    <AppModuleSelector class="mt-2 ml-0.5" />
  </NCard>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { NButton, useModal, NIcon, NCard } from 'naive-ui'
import { SettingsRound as SettingIcon, QuestionAnswerRound as QAIcon } from '@vicons/material'
import SettingPanel from '../setting/SettingPanel.vue'
import { useSettingStore } from '@renderer/stores/setting'
import QuestionAnswer from '../qa/QuestionAnswer.vue'
import ThemeIcon from '../icon/Theme.vue'
import { cloneDeep } from 'lodash'
import AppModuleSelector from './AppModuleSelector.vue'

const modal = useModal()
const settingStore = useSettingStore()
function handleOpenSetting(): void {
  modal.create({
    render() {
      return h(SettingPanel)
    }
  })
}
function handleOpenQA(): void {
  modal.create({
    render() {
      return h(QuestionAnswer)
    }
  })
}
function handleSwitchTheme(): void {
  const newConfig = cloneDeep(settingStore.setting)!
  if (newConfig.theme === 'dark') {
    newConfig.theme = 'light'
  } else {
    newConfig.theme = 'dark'
  }
  settingStore.saveSetting(newConfig)
}
</script>
