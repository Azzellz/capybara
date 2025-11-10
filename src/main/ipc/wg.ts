import { spawn } from 'child_process'
import { getResourceFilePath, parseWireGuardShow } from '../utils'
import type { RemoveFirstParamFromFunctions, WireGuardCode } from '@shared/types'
import { writeFile, mkdir } from 'fs/promises'
import { API } from '../api'
import { notification } from '../utils/system'
import { dirname } from 'path'

export const wireguardIpcHandlers = {
  async startWireGuard(_, name: string) {
    try {
      return new Promise<WireGuardCode>((resolve) => {
        const child = spawn(
          getResourceFilePath('wireguard/bin/wireguard.exe'),
          ['/installtunnelservice', getResourceFilePath(`wireguard/conf/${name}.conf`)],
          {
            stdio: ['ignore', 'pipe', 'pipe']
          }
        )
        child.on('close', (code) => {
          notification(`tunnel ⌈${name}⌋ connected.`)
          resolve(code as WireGuardCode)
        })
      })
    } catch (error) {
      console.error('Failed to start WireGuard:', error)
      return -1
    }
  },
  async stopWireGuard(_, name: string) {
    try {
      return new Promise<WireGuardCode>((resolve) => {
        const child = spawn(
          getResourceFilePath('wireguard/bin/wireguard.exe'),
          ['/uninstalltunnelservice', name],
          {
            stdio: ['ignore', 'pipe', 'pipe']
          }
        )

        child.on('close', (code) => {
          notification(`tunnel ⌈${name}⌋ disconnected.`)
          resolve(code as WireGuardCode)
        })
      })
    } catch (error) {
      notification(`Failed to stop WireGuard: ${error}`)
      console.error('Failed to stop WireGuard:', error)
      return -1
    }
  },
  async getWireGuardStatus() {
    try {
      const show = await new Promise((resolve) => {
        const child = spawn(getResourceFilePath('wireguard/bin/wg.exe'), ['show'], {
          stdio: ['ignore', 'pipe', 'pipe']
        })

        child.stdout.on('data', (d) => {
          const show = parseWireGuardShow(d.toString())
          resolve(show)
        })
        child.on('close', () => {
          resolve(null)
        })
      })
      return JSON.stringify(show)
    } catch (error) {
      notification(`Failed to get WireGuard status: ${error}`)
      console.error('Failed to get WireGuard status:', error)
      return null
    }
  },
  async syncWireGuardConfigs() {
    try {
      const clients = await API.getClientsWithConfig()
      for (const client of clients) {
        if (client.configStr) {
          const path = getResourceFilePath(`wireguard/conf/${client.name}.conf`)
          await mkdir(dirname(path), { recursive: true })
          await writeFile(path, client.configStr)
        }
      }
      return true
    } catch (error) {
      notification(`Failed to sync WireGuard configs: ${error}`)
      console.error('Failed to sync WireGuard configs:', error)
      return false
    }
  }
}

export type WireGuardIPC = RemoveFirstParamFromFunctions<typeof wireguardIpcHandlers>
