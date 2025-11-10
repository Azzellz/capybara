/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_URL: string
  readonly MAIN_VITE_SECRET: string
  readonly MAIN_VITE_TITLE: string
  readonly MAIN_VITE_SUBTITLE: string
  readonly MAIN_VITE_AUTOSYNC_ENABLE: string
  readonly MAIN_VITE_AUTOSYNC_INTERVAL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
