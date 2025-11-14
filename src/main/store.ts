/* eslint-disable @typescript-eslint/no-explicit-any */
import { Config } from '@shared/types'
import { nativeTheme } from 'electron'
import _Store from 'electron-store'
const Store: typeof _Store = (_Store as any).default || _Store

export const defaults: { config: Config } = {
  config: {
    logo: import.meta.env.MAIN_VITE_LOGO,
    theme: nativeTheme.shouldUseDarkColors ? 'dark' : 'light',
    url: import.meta.env.MAIN_VITE_URL || '',
    title: import.meta.env.MAIN_VITE_TITLE || 'Capybara',
    subtitle: import.meta.env.MAIN_VITE_SUBTITLE || 'A lazy WireGuard client based on wg-easy.',
    autoSync: {
      enable: Boolean(import.meta.env.MAIN_VITE_AUTOSYNC_ENABLE) || true,
      interval: parseInt(import.meta.env.MAIN_VITE_AUTOSYNC_INTERVAL || '1000') || 1000
    },
    password: {
      enable: !import.meta.env.MAIN_VITE_SECRET,
      value: ''
    }
  }
}
export const store = new Store<{
  config: Config
}>({
  defaults,
  encryptionKey: 'aes-256-cbc',
  clearInvalidConfig: true
})
