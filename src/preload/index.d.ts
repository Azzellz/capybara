import type { API } from '../main/api'
import type { IpcHandlers } from '../main/ipc'

declare global {
  interface Window {
    electronAPI: {
      openExternal: (url: string) => void
    }
    api: API
    ipcInvoke: IpcHandlers
  }
}
