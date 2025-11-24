import { RemoveFirstParamFromFunctions } from '@shared/types'
import { WgAPI } from './wg'

export const API = {
  ...WgAPI
}
export type API = RemoveFirstParamFromFunctions<typeof API>
