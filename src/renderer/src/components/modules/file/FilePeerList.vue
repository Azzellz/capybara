<template>
  <NScrollbar style="height: 350px" class="flex flex-col gap-5 pb-4">
    <template v-for="client in wgStore.clients" :key="client.id">
      <FilePeerLine class="mx-4" :client="client" />
      <NDivider />
    </template>
  </NScrollbar>
</template>

<script setup lang="ts">
import { useWgStore } from '@renderer/stores/wg'
import FilePeerLine from './FilePeerLine.vue'
import { NDivider, NScrollbar } from 'naive-ui'

const wgStore = useWgStore()
</script>
