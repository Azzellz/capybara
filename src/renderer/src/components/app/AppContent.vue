<script setup lang="ts">
import ClientModule from '@renderer/components/modules/client/ClientModule.vue'
import FileModule from '@renderer/components/modules/file/FileModule.vue'
import { NCard } from 'naive-ui'
import { useGlobalStore } from '@renderer/stores/global'

const globalStore = useGlobalStore()
</script>

<template>
  <NCard class="shadow-[2px_2px_2px_2px_#999]" content-style="padding: 0px">
    <ClientModule v-if="globalStore.currentModule === 'client'" />
    <FileModule v-else-if="globalStore.currentModule === 'file'" />
  </NCard>
</template>
