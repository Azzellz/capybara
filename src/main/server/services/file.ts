import { Hono } from 'hono'
import fs from 'fs/promises'
import { existsSync, Stats } from 'fs'
import type { DownloadFileRequest, UploadFileRequest, ClientFile } from '@shared/types'
import { join, normalize } from 'path'
import { parseBody } from 'hono/utils/body'
import { getFileTree } from '../../utils'

export const FileService = new Hono()

// Get file list (nested)
FileService.get('/list/:dir', async (c) => {
  // decode & normalize incoming dir, and request full recursion
  const rawDir = c.req.param('dir') || ''
  const dir = normalize(decodeURIComponent(rawDir))

  // request full recursion (use Infinity or a large number)
  const results = await getFileTree(dir, Infinity) // returns FileTree[]

  async function buildTree(nodes: typeof results, basePath: string): Promise<ClientFile[]> {
    const out: ClientFile[] = []
    for (const node of nodes) {
      const fullPath = join(basePath, node.name)
      let exists = existsSync(fullPath)
      let stat: Stats | null = null
      try {
        stat = exists ? await fs.stat(fullPath) : null
      } catch (e) {
        exists = false
        stat = null
        console.error('Error stating file:', e)
      }

      if (node.type === 'directory') {
        const children =
          node.children && node.children.length ? await buildTree(node.children, fullPath) : []
        out.push({
          path: fullPath,
          exists,
          name: node.name,
          size: stat?.size ?? 0,
          isDir: true,
          children
        } as ClientFile)
      } else {
        out.push({
          path: fullPath,
          exists,
          name: node.name,
          size: stat?.size ?? 0,
          isDir: false
        } as ClientFile)
      }
    }
    return out
  }

  const fileList = await buildTree(results, dir)
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

// Upload file
FileService.post('/upload', async (c) => {
  const form: UploadFileRequest = await parseBody(c.req)
  const rawPath = form.path
  if (!rawPath) return c.json({ ok: false, msg: 'missing path' }, 400)
  const saveDir = normalize(decodeURIComponent(rawPath))

  const file = form.file
  if (!file) return c.json({ ok: false, msg: 'missing file' }, 400)

  // Get overwrite flag (default to true)
  const overwrite = form.overwrite !== 'false' && form.overwrite !== false

  const fullPath = join(saveDir, file.name)

  // If file exists and overwrite is not allowed, return error
  if (!overwrite && existsSync(fullPath)) {
    return c.json({ ok: false, msg: 'file already exists', path: fullPath }, 409)
  }

  await fs.mkdir(saveDir, { recursive: true })
  await fs.writeFile(fullPath, file.stream())

  return c.json({ ok: true, savedTo: fullPath, overwritten: existsSync(fullPath) })
})
