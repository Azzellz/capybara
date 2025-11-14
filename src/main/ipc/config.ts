import { Config, RemoveFirstParamFromFunctions } from '@shared/types'
import { defaults, store } from '../store'

export const configIpcHandlers = {
  async getConfig(): Promise<Config | null> {
    try {
      return store.get('config')
    } catch (error) {
      console.error('Failed to read config file:', error)
      return null
    }
  },
  async setConfig(_, newConfig: Config): Promise<string | void> {
    try {
      store.set('config', newConfig)
      return
    } catch (error) {
      const errorMsg = 'Failed to write config file:' + error
      console.error(errorMsg)
      return errorMsg
    }
  },
  async restoreConfig(): Promise<void> {
    try {
      store.set('config', defaults.config)
    } catch (error) {
      const errorMsg = 'Failed to restore config file:' + error
      console.error(errorMsg)
    }
  }
}

export type ConfigIpc = RemoveFirstParamFromFunctions<typeof configIpcHandlers>
