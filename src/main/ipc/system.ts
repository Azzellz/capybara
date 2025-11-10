import ping from 'ping'

export const systemIpcHandlers = {
  async ping(_, ip: string): Promise<string> {
    const res = await ping.promise.probe(ip)
    return res.avg // ms
  }
}

export type SystemIpcHandlers = typeof systemIpcHandlers
