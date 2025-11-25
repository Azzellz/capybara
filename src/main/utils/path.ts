import { FileTree } from '@shared/types'
import { opendir } from 'fs/promises'
import path, { join } from 'node:path'

export function getResourceFilePath(name: string): string {
  if (process.env.NODE_ENV === 'development') {
    return path.join(__dirname, '../../resources', name)
  } else {
    return path.join(process.resourcesPath, 'app.asar.unpacked', 'resources', name)
  }
}

export function getResourceDirPath(): string {
  if (process.env.NODE_ENV === 'development') {
    return path.join(__dirname, '../../resources')
  } else {
    return path.join(process.resourcesPath, 'app.asar.unpacked', 'resources')
  }
}

export async function getFileTree(dir: string, level: number = Infinity): Promise<FileTree[]> {
  async function readDir(cur: string, depth: number): Promise<FileTree[]> {
    const res: FileTree[] = []
    try {
      const dirH = await opendir(cur)
      for await (const ent of dirH) {
        const full = join(cur, ent.name)
        if (ent.isDirectory()) {
          const node: FileTree = { name: ent.name, type: 'directory' }
          if (depth < level) {
            node.children = await readDir(full, depth + 1)
          }
          res.push(node)
        } else if (ent.isFile()) {
          res.push({ name: ent.name, type: 'file' })
        }
        // ignore other types (symlink, socket, etc.)
      }
    } catch (err) {
      // ignore errors
      console.error('Error reading directory:', err)
    }
    return res
  }

  // 返回指定目录下的条目（作为 FileStruct 数组）
  return await readDir(dir, 0)
}
