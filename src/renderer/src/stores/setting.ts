/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Config } from '@shared/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSettingStore = defineStore('setting-store', () => {
  const setting = ref<Config | null>(null)
  const isValid = ref<boolean>(false)
  function setIsValid(value: boolean) {
    isValid.value = value
  }
  const isEmpty = computed(() => {
    if (!setting.value) return true
    if (!setting.value.url) return true
    if (setting.value.password.enable && !setting.value.password.value) return true
    return false
  })

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
    getSetting,
    isEmpty,
    isValid,
    setIsValid
  }
})
