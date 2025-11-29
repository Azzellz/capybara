import type { RemoveFirstParamFromFunctions, WireGuardCode } from '@shared/types'
import { getResourceFilePath, parseWireGuardShow } from '../utils'
import { writeFile, mkdir, rm } from 'fs/promises'
import { notification } from '../utils/system'
import { execa } from 'execa'
import { API } from '../api'

const execaOptions: { stdio: ['ignore', 'pipe', 'pipe'] } = {
  stdio: ['ignore', 'pipe', 'pipe']
}
export const wireguardIpcHandlers = {
  async startWireGuard(_, name: string) {
    try {
      const configPath = getResourceFilePath(`wireguard/conf/${name}.conf`)
      const startCommand = process.platform === 'win32' ? '/installtunnelservice' : 'up'
      const result = await execa(
        getResourceFilePath(`wireguard/bin/${process.platform}/wg-quick`),
        [startCommand, configPath],
        execaOptions
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
      // const configPath = getResourceFilePath(`wireguard/conf/${name}.conf`)
      const downCommand = process.platform === 'win32' ? '/uninstalltunnelservice' : 'down'
      const result = await execa(
        getResourceFilePath(`wireguard/bin/${process.platform}/wg-quick`),
        [downCommand, name],
        execaOptions
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
      const { stdout } = await execa(
        getResourceFilePath(`wireguard/bin/${process.platform}/wg`),
        ['show'],
        execaOptions
      )
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
