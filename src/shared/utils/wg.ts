import { WireGuardConfig } from '../types'

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
