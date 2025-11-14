<script setup lang="ts">
import ClientPanelStatics from './ClientPanelStatics.vue'
import ClientList from './ClientList.vue'
import ClientPanelActions from './ClientPanelActions.vue'
</script>

<template>
  <main class="py-2">
    <ClientPanelActions />
    <ClientPanelStatics />
    <ClientList />
  </main>
</template>
