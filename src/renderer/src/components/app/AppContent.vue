<script setup lang="ts">
import ClientModule from '@renderer/components/modules/client/ClientModule.vue'
import FileModule from '@renderer/components/modules/file/FileModule.vue'
import { NCard } from 'naive-ui'
import { useGlobalStore } from '@renderer/stores/global'

const globalStore = useGlobalStore()
const components = {
  client: ClientModule,
  file: FileModule
}
</script>

<template>
  <NCard class="shadow-[2px_2px_2px_2px_#999]" content-style="padding: 0px">
    <Transition name="fade" mode="out-in">
      <KeepAlive>
        <component :is="components[globalStore.currentModule]" />
      </KeepAlive>
    </Transition>
  </NCard>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
