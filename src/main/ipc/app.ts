import { RemoveFirstParamFromFunctions } from '@shared/types'
import { app } from 'electron'

export const appIpcHandlers = {
  async getAppVersion(): Promise<string> {
    return app.getVersion()
  }
}
export type AppIpcHandler = RemoveFirstParamFromFunctions<typeof appIpcHandlers>
