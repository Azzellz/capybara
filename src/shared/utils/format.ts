export function formatBytes(bytes: number, decimals = 2, binaryUnits = false): string {
  if (bytes === 0) return '0 B'

  const k = binaryUnits ? 1024 : 1000
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
