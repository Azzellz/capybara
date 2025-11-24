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

export async function getAllFilePaths(dir: string, level: number = Infinity): Promise<string[]> {
  const res: string[] = []
  const queue: [string, number][] = [[dir, 0]]

  while (queue.length) {
    const [cur, depth] = queue.shift()!
    if (depth > level) continue

    const dirH = await opendir(cur)
    for await (const ent of dirH) {
      const full = join(cur, ent.name)
      if (ent.isDirectory()) {
        queue.push([full, depth + 1])
      } else if (ent.isFile()) {
        res.push(full)
      }
    }
  }
  return res
}
