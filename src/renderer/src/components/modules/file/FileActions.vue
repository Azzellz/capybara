<template>
  <div class="px-6 pt-4 flex items-center gap-2">
    <h2>File Module</h2>
    <div class="flex items-center ml-auto">
      <NInput v-model:value="targetPath" clearable placeholder="the path you want to sync.">
        <template #prefix>
          <span class="text-gray"> Target: </span>
        </template>
      </NInput>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NInput } from 'naive-ui'
const targetPath = defineModel<string>('targetPath', { required: true })
</script>
