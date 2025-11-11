<script setup lang="ts">
import AppHeader from '@renderer/components/app/AppHeader.vue'
import AppContent from '@renderer/components/app/AppContent.vue'
import AppGuard from '@renderer/components/app/AppGuard.vue'
import AppFooter from '@renderer/components/app/AppFooter.vue'
import AppProvider from '@renderer/components/app/AppProvider.vue'
</script>

<template>
  <AppProvider>
    <AppGuard>
      <AppHeader />
      <AppContent />
      <AppFooter />
    </AppGuard>
  </AppProvider>
</template>
