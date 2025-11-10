import { ipcMain } from 'electron'
import { wireguardIpcHandlers } from './wg'
import { API } from '../api'
import { RemoveFirstParamFromFunctions } from '@shared/types'
import { configIpcHandlers } from './config'
import { systemIpcHandlers } from './system'

const ipcHandlers = {
  // IPC handlers will be registered here
  ...wireguardIpcHandlers,
  ...configIpcHandlers,
  ...systemIpcHandlers
}

export type IpcHandlers = RemoveFirstParamFromFunctions<typeof ipcHandlers>

export function registerIpcHandlers(): void {
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.handle('getIpcHandlerForPreload', () => {
    return [...Object.keys(ipcHandlers), ...Object.keys(API).map((name) => `api/${name}`)] // return all handler names
  })
  Object.entries(ipcHandlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, handler)
  })
  Object.entries(API).forEach(([channel, handler]) => {
    ipcMain.handle(`api/${channel}`, handler)
  })
}
