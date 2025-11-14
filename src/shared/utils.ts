import { WireGuardConfig } from './types'

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function isValidURL(
  url: string,
  opts: { protocols?: string[]; requireTld?: boolean } = {}
): boolean {
  const { protocols = ['http', 'https'], requireTld = true } = opts

  try {
    const u = new URL(url)

    if (!protocols.includes(u.protocol.slice(0, -1))) return false

    if (!u.hostname) return false

    if (requireTld && !u.hostname.includes('.')) return false

    return true
  } catch {
    return false
  }
}

type URLParts = {
  protocol: string
  hostname: string
  port: string
}

export function parseURL(url: string): URLParts {
  const u = new URL(url)
  return {
    protocol: u.protocol.slice(0, -1),
    hostname: u.hostname,
    port: u.port || ''
  }
}

export function formatBytes(bytes: number, decimals = 2, binaryUnits = false): string {
  if (bytes === 0) return '0 B'

  const k = binaryUnits ? 1024 : 1000
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

function wgKeyToCamel(key: string): string {
  if (key === 'AllowedIPs') return 'allowedIPs'
  if (key === 'PersistentKeepalive') return 'persistentKeepalive'
  return key.charAt(0).toLowerCase() + key.slice(1)
}

export function parseWireGuardConfig(configText: string): WireGuardConfig {
  const lines = configText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  const sectionMap: Record<string, Record<string, string>> = {}

  let section = ''
  for (const line of lines) {
    if (line.startsWith('[') && line.endsWith(']')) {
      section = line.slice(1, -1).toLowerCase()
      sectionMap[section] = {}
      continue
    }
    if (!section) continue

    const idx = line.indexOf('=')
    if (idx === -1) continue

    const rawKey = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    const key = wgKeyToCamel(rawKey)

    sectionMap[section][key] = value
  }

  return {
    interface: {
      privateKey: sectionMap.interface?.privateKey || '',
      address: sectionMap.interface?.address || '',
      dns: sectionMap.interface?.dns || '',
      mtu: Number(sectionMap.interface?.mtu || 1420)
    },
    peer: {
      publicKey: sectionMap.peer?.publicKey || '',
      presharedKey: sectionMap.peer?.presharedKey || '',
      allowedIPs: sectionMap.peer?.allowedIPs || '',
      persistentKeepalive: Number(sectionMap.peer?.persistentKeepalive || 0),
      endpoint: sectionMap.peer?.endpoint || ''
    }
  }
}
