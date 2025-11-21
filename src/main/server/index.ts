import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { FileService } from './services/file'

const app = new Hono()
app.get('/', (c) => c.text('Hello Capybara!'))
app.route('/file', FileService)

export async function startHttpServer(): Promise<void> {
  serve(app, (info) => {
    console.log(`Capybara Server Listening on http://localhost:${info.port}`)
  })
}
