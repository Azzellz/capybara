<template>
  <div class="px-4 flex items-center gap-2">
    <h2 class="text-2xl p-4">File Module</h2>
    <div class="flex items-center ml-auto">
      <NInput
        v-model:value="targetPath"
        size="small"
        clearable
        placeholder="the path you want to sync."
      >
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
