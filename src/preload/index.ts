import { contextBridge, ipcRenderer, shell } from 'electron'

// Dynamically generate IPC invoke methods
ipcRenderer.invoke('getIpcHandlerForPreload').then((handlers: string[]) => {
  const electronAPIContent = {}
  const api = {}
  for (const handlerName of handlers) {
    if (handlerName.startsWith('api/')) {
      api[handlerName.replace('api/', '')] = (...args) => {
        return ipcRenderer.invoke(handlerName, ...args)
      }
    } else {
      electronAPIContent[handlerName] = (...args) => {
        return ipcRenderer.invoke(handlerName, ...args)
      }
    }
  }
  contextBridge.exposeInMainWorld('ipcInvoke', electronAPIContent)
  contextBridge.exposeInMainWorld('api', api)
})

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
const electronAPI = {
  openExternal: (url: string) => shell.openExternal(url)
}
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electronAPI = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
