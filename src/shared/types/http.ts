/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientFile } from './client'

export interface QueryFileListResponse {
  list: ClientFile[]
}
export interface DownloadFileRequest {
  path: string
}
export interface UploadFileRequest {
  [x: string]: any
  path: string
  file: File
}
export interface BaseResponse {
  ok: boolean
  msg: string
}
