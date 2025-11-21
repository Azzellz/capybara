export interface Config {
  url: string
  title: string
  subtitle: string
  theme: 'dark' | 'light'
  autoSync: {
    enable: boolean
    interval: number // ms
  }
  logo?: string
  password: {
    enable: boolean
    value: string
  }
}
