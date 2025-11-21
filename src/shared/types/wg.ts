export type WireGuardCode = 0 | 1 | -1

export interface WireGuardStatus {
  interface: WireGuardInterface
  peers: WireGuardPeer[]
}

export interface WireGuardClient {
  id: string
  name: string
  downloadableConfig: boolean
  enabled: boolean
  publicKey: string
  address: string
  configStr: string
  config: WireGuardConfig
  createdAt: Date
  updatedAt: Date
  latestHandshakeAt: Date | null
  delay?: string
  isKeepAlive: boolean
  transferRx: number
  transferTx: number
  transferRxDiff: number
  transferTxDiff: number
}

export interface WireGuardInterface {
  name: string
  publicKey: string
  privateKey?: string
  listenPort?: number
  allowedIps?: string[]
}

export interface WireGuardPeer {
  publicKey: string
  presharedKey?: string
  endpoint?: string
  allowedIps: string[]
  latestHandshake?: string
  transferRx?: string
  transferTx?: string
  persistentKeepalive?: string
}

export interface WireGuardConfig {
  interface: {
    privateKey: string
    address: string
    mtu: number
    dns: string
  }
  peer: {
    publicKey: string
    presharedKey: string
    allowedIPs: string
    endpoint: string
    persistentKeepalive: number
  }
}
