import path from 'node:path'

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
