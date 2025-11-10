import { dialog, Notification } from 'electron'
import { getResourceFilePath } from './path'

export function exitApp(reason: string): void {
  dialog.showErrorBox('Error: ', reason)
  process.exit(-1)
}

export function notification(content: string): void {
  new Notification({
    icon: getResourceFilePath('icon.png'),
    title: 'Capybara',
    body: content
  }).show()
}
