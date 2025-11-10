<template>
  <NCard class="min-w-1/2 w-auto">
    <h2>Question & Answer</h2>
    <NDivider style="margin-top: 8px; margin-bottom: 16px" />
    <div class="flex gap-2">
      <div class="flex flex-col gap-6 overflow-auto w-350px">
        <div>
          <h3>What is Capybara?</h3>
          <div class="text-sm">
            The capybara is a big, friendly rodent from South America. It likes water and lives in
            groups. ----->
          </div>
        </div>
        <div>
          <h3>Why choose Capybara?</h3>
          <div class="text-sm">We want you to use a more modern and lazy Wireguard client.</div>
        </div>
        <div>
          <h3>Is Capybara free?</h3>
          <div class="text-sm">Capybara is always free and follows the GPL3 license</div>
        </div>
      </div>
      <div class="ml-auto flex flex-col">
        <img class="my-auto" width="100" src="@renderer/assets/images/capybara.gif" />
      </div>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { NCard, NDivider } from 'naive-ui'
</script>
