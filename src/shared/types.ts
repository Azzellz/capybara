/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface Config {
  logo?: string
  theme?: 'dark' | 'light'
  url: string
  title: string
  subtitle: string
  autoSync: {
    enable: boolean
    interval: number // ms
  }
}

type DropFirstArg<T> = T extends (first: any, ...rest: infer R) => infer Ret
  ? (...args: R) => Ret
  : T

export type RemoveFirstParamFromFunctions<T> = {
  [K in keyof T]: DropFirstArg<T[K]>
}
