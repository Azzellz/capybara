import { Hono } from 'hono'
import fs from 'fs/promises'
import { existsSync } from 'fs'
import type { DownloadFileRequest, UploadFileRequest } from '@shared/types'
import { join, normalize } from 'path'
import { parseBody } from 'hono/utils/body'

export const FileService = new Hono()

// Get file list
FileService.get('/list/:paths', async (c) => {
  const paths = c.req.param('paths')
  const fileList = paths.split(',').map(async (path) => {
    const exists = existsSync(path)
    const stat = exists ? await fs.stat(path) : null
    if (!exists || !stat) {
      return {
        path,
        exists,
        size: 0,
        name: ''
      }
    } else {
      return {
        path,
        exists,
        size: stat.size,
        name: stat.isDirectory() ? '' : path.split('/').pop() || ''
      }
    }
  })
  return c.json(fileList)
})

// Download file
FileService.post('/download', async (c) => {
  const body: DownloadFileRequest = await c.req.json()
  const { path } = body
  const exists = existsSync(path)
  if (!exists) {
    return c.body(null)
  } else {
    const file = await fs.readFile(path)
    return c.body(file)
  }
})

FileService.post('/upload', async (c) => {
  const form: UploadFileRequest = await parseBody(c.req)

  const rawPath = form.path
  if (!rawPath) return c.json({ ok: false, msg: 'missing path' }, 400)
  const saveDir = normalize(decodeURIComponent(rawPath))

  const file = form.file
  if (!file) return c.json({ ok: false, msg: 'missing file' }, 400)

  const fullPath = join(saveDir, file.name)

  await fs.mkdir(saveDir, { recursive: true })
  await fs.writeFile(fullPath, file.stream())

  return c.json({ ok: true, savedTo: fullPath })
})
