/* eslint-disable @typescript-eslint/no-explicit-any */
export interface QueryFileListResponse {
  path: string
  exists: boolean
  size: number
  name: string
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
