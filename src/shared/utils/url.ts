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
