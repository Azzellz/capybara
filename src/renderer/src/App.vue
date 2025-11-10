<script setup lang="ts">
import AppHeader from '@renderer/components/app/AppHeader.vue'
import AppContent from '@renderer/components/app/AppContent.vue'
import AppGuard from '@renderer/components/app/AppGuard.vue'
import AppFooter from '@renderer/components/app/AppFooter.vue'
</script>

<template>
  <AppGuard>
    <AppHeader />
    <AppContent />
    <AppFooter />
  </AppGuard>
</template>
