<template>
  <NScrollbar style="height: 350px" class="flex flex-col gap-5 pb-4">
    <template v-for="client in wgStore.clients" :key="client.id">
      <FilePeerItem class="mx-4" :client="client" />
      <NDivider />
    </template>
  </NScrollbar>
</template>

<script setup lang="ts">
import { useWgStore } from '@renderer/stores/wg'
import FilePeerItem from './FilePeerItem.vue'
import { NDivider, NScrollbar } from 'naive-ui'

const wgStore = useWgStore()
</script>
