<script setup lang="ts">
import AppHeader from '@renderer/components/app/AppHeader.vue'
import AppContent from '@renderer/components/app/AppContent.vue'
import AppGuard from '@renderer/components/app/AppGuard.vue'
import AppFooter from '@renderer/components/app/AppFooter.vue'
import AppProvider from '@renderer/components/app/AppProvider.vue'
import AppModule from '@renderer/components/app/AppModule.vue'
</script>

<template>
  <AppProvider>
    <AppGuard>
      <AppHeader />
      <AppModule />
      <AppContent />
      <AppFooter />
    </AppGuard>
  </AppProvider>
</template>
