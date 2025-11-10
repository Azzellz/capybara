<template>
  <div class="flex gap-4 items-center justify-center text-gray text-sm">
    <span>© 2025 Yuzutea. GPL3.0 License</span>
    <NButton text class="text-gray" @click="handleOpenGithub">
      <NIcon size="20">
        <GithubIcon />
      </NIcon>
    </NButton>
  </div>
</template>

<script setup lang="ts">
import { NIcon, NButton } from 'naive-ui'
import GithubIcon from '../icon/Github.vue'
function handleOpenGithub(): void {
  window.electronAPI.openExternal('https://github.com/Azzellz/capybara')
}
</script>
