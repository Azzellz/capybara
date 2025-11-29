import type { RemoveFirstParamFromFunctions } from '@shared/types'

export const serverIpcHandlers = {
  getServerPort() {
    return process.env.MAIN_VITE_SERVER_PORT || '3000'
  }
}
export type ServerIpcHandler = RemoveFirstParamFromFunctions<typeof serverIpcHandlers>
