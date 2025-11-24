import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('global-store', () => {
  const currentModule = ref('client')
  const isLoading = ref(false)

  return {
    currentModule,
    isLoading
  }
})
