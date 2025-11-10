/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Config } from '@shared/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore('setting-store', () => {
  const setting = ref<Config | null>(null)

  async function getSetting() {
    const result = await window.ipcInvoke.getConfig()
    if (result) {
      setting.value = result
    }
    return result
  }

  async function saveSetting(newConfig: Config) {
    const err = await window.ipcInvoke.setConfig(newConfig)
    if (!err) {
      setting.value = newConfig
    }
    return err
  }

  return {
    setting,
    saveSetting,
    getSetting
  }
})
