<script setup lang="ts">
import { ref } from 'vue'
import FileActions from './FileActions.vue'
import FilePeerList from './FilePeerList.vue'
import { NDivider } from 'naive-ui'

const targetPath = ref('')
</script>

<template>
  <main class="py-2">
    <FileActions v-model:target-path="targetPath" />
    <NDivider />
    <FilePeerList :target-path="targetPath" />
  </main>
</template>
