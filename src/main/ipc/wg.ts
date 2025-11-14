import type { RemoveFirstParamFromFunctions, WireGuardCode } from '@shared/types'
import { execa } from 'execa'
import { getResourceFilePath, parseWireGuardShow } from '../utils'
import { writeFile, mkdir, rm } from 'fs/promises'
import { API } from '../api'
import { notification } from '../utils/system'

export const wireguardIpcHandlers = {
  async startWireGuard(_, name: string) {
    try {
      const result = await execa(
        getResourceFilePath('wireguard/bin/wireguard'),
        ['/installtunnelservice', getResourceFilePath(`wireguard/conf/${name}.conf`)],
        {
          stdio: ['ignore', 'pipe', 'pipe']
        }
      )

      if (result.exitCode === 0) {
        notification(`tunnel ⌈${name}⌋ connected.`)
        return result.exitCode as WireGuardCode
      } else {
        notification(`Failed to start WireGuard: ${result.stderr}`)
        return result.exitCode as WireGuardCode
      }
    } catch (error) {
      console.error('Failed to start WireGuard:', error)
      return -1
    }
  },
  async stopWireGuard(_, name: string) {
    try {
      const result = await execa(
        getResourceFilePath('wireguard/bin/wireguard.exe'),
        ['/uninstalltunnelservice', name],
        {
          stdio: ['ignore', 'pipe', 'pipe']
        }
      )

      if (result.exitCode === 0) {
        notification(`tunnel ⌈${name}⌋ disconnected.`)
        return result.exitCode as WireGuardCode
      } else {
        notification(`Failed to stop WireGuard: ${result.stderr}`)
        return result.exitCode as WireGuardCode
      }
    } catch (error) {
      notification(`Failed to stop WireGuard: ${error}`)
      console.error('Failed to stop WireGuard:', error)
      return -1
    }
  },
  async getWireGuardStatus() {
    try {
      const { stdout } = await execa(getResourceFilePath('wireguard/bin/wg.exe'), ['show'], {
        stdio: ['ignore', 'pipe', 'pipe']
      })
      const show = parseWireGuardShow(stdout)
      return JSON.stringify(show)
    } catch (error) {
      if (!(error + '').startsWith('Error: No interface section found')) {
        notification(`Failed to get WireGuard status: ${error}`)
        console.error('Failed to get WireGuard status:', error)
      }
      return null
    }
  },
  async downloadWireGuardConfigs() {
    try {
      const dir = getResourceFilePath('wireguard/conf')
      await rm(dir, { recursive: true, force: true })
      await mkdir(dir, { recursive: true })
      const clients = await API.getClientsWithConfig()
      for (const client of clients) {
        if (client.enabled && client.configStr) {
          const path = getResourceFilePath(`wireguard/conf/${client.name}.conf`)
          await writeFile(path, client.configStr)
        }
      }
      return true
    } catch (error) {
      notification(`Failed to download WireGuard configs: ${error}`)
      console.error('Failed to download WireGuard configs:', error)
      return false
    }
  }
}

export type WireGuardIPC = RemoveFirstParamFromFunctions<typeof wireguardIpcHandlers>
