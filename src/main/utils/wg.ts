import { WireGuardInterface, WireGuardPeer, WireGuardStatus } from '@shared/types'

/**
 * 解析 `wg show all dump` 的“人类可读”输出
 * @param text 完整原始字符串
 */
export function parseWireGuardShow(text: string): WireGuardStatus {
  const lines = text.split(/\r?\n/).map((l) => l.trimEnd())
  let iface: WireGuardInterface | null = null
  const peers: WireGuardPeer[] = []

  for (let i = 0; i < lines.length; ) {
    const line = lines[i]
    if (!line) {
      i++
      continue
    }

    /* 1. Interface 段落 */
    if (line.startsWith('interface:')) {
      const name = line.slice('interface:'.length).trim()
      iface = { name, publicKey: '', allowedIps: [] as string[] } // 临时占位
      i++
      while (i < lines.length && lines[i].startsWith(' ')) {
        const kv = lines[i].trim()
        if (!iface) break
        if (kv.startsWith('public key:')) {
          iface.publicKey = kv.slice('public key:'.length).trim()
        } else if (kv.startsWith('private key:')) {
          const v = kv.slice('private key:'.length).trim()
          if (v !== '(hidden)') iface.privateKey = v
        } else if (kv.startsWith('listening port:')) {
          iface.listenPort = Number(kv.slice('listening port:'.length).trim())
        }
        i++
      }
      continue
    }

    /* 2. Peer 段落 */
    if (line.startsWith('peer:')) {
      const publicKey = line.slice('peer:'.length).trim()
      const peer: WireGuardPeer = { publicKey, allowedIps: [] }
      i++
      while (i < lines.length && lines[i].startsWith(' ')) {
        const kv = lines[i].trim()
        if (kv.startsWith('preshared key:')) {
          const v = kv.slice('preshared key:'.length).trim()
          if (v !== '(hidden)') peer.presharedKey = v
        } else if (kv.startsWith('endpoint:')) {
          peer.endpoint = kv.slice('endpoint:'.length).trim()
        } else if (kv.startsWith('allowed ips:')) {
          peer.allowedIps = kv
            .slice('allowed ips:'.length)
            .trim()
            .split(',')
            .map((s: string) => s.trim())
        } else if (kv.startsWith('latest handshake:')) {
          peer.latestHandshake = kv.slice('latest handshake:'.length).trim()
        } else if (kv.startsWith('transfer:')) {
          const parts = kv
            .slice('transfer:'.length)
            .trim()
            .split(',')
            .map((s: string) => s.trim())
          if (parts.length === 2) {
            peer.transferRx = parts[0].replace(' received', '')
            peer.transferTx = parts[1].replace(' sent', '')
          }
        } else if (kv.startsWith('persistent keepalive:')) {
          peer.persistentKeepalive = kv.slice('persistent keepalive:'.length).trim()
        }
        i++
      }
      peers.push(peer)
      continue
    }

    /* 3. 其他未知行，跳过 */
    i++
  }

  if (!iface) throw new Error('No interface section found')
  return { interface: iface, peers }
}
