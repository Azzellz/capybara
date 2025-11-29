export interface ClientFile {
  name: string
  path: string
  exists: boolean
  size: number
  isDir: boolean
  children?: ClientFile[]
}

export type FileSyncStatus = 'waiting' | 'downloading' | 'uploading' | 'completed' | 'failed'
export interface FileTree {
  name: string
  type: 'file' | 'directory'
  children?: FileTree[]
}
