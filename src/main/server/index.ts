import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { FileService } from './services/file'

const app = new Hono()
app.use('*', cors())
app.get('/', (c) => c.text('Hello Capybara!'))
app.route('/file', FileService)

export async function startHttpServer(): Promise<void> {
  serve(
    {
      ...app,
      port: parseInt(process.env.MAIN_VITE_SERVER_PORT || '3000')
    },
    (info) => {
      console.log(`Capybara Server Listening on http://${info.address}:${info.port}`)
    }
  )
}
