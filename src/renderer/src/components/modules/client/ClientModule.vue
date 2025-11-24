<script setup lang="ts">
import ClientStatics from './ClientStatics.vue'
import ClientList from './ClientList.vue'
import ClientActions from './ClientActions.vue'
</script>

<template>
  <main class="py-2">
    <ClientActions />
    <ClientStatics />
    <ClientList />
  </main>
</template>
