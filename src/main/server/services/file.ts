import { Hono } from 'hono'
import fs from 'fs/promises'
import { existsSync } from 'fs'
import type { DownloadFileRequest, UploadFileRequest, ClientFile } from '@shared/types'
import { join, normalize } from 'path'
import { parseBody } from 'hono/utils/body'
import { getAllFilePaths } from '../../utils'

export const FileService = new Hono()

// Get file list
FileService.get('/list/:dir', async (c) => {
  const dir = c.req.param('dir')
  const fileList: ClientFile[] = []
  const results = await getAllFilePaths(dir, 0)
  for (const path of results) {
    const exists = existsSync(path)
    const stat = exists ? await fs.stat(path) : null
    if (exists && stat) {
      fileList.push({
        path,
        exists,
        size: stat.size,
        isDir: stat.isDirectory()
      })
    }
  }
  return c.json({ list: fileList })
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
