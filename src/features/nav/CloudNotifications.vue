<template>
  <v-menu v-if="store.IsLoggedIn"
    v-model="menu"
    :close-on-content-click="false">
    <template #activator="{ props }">
      <cc-button size="x-small"
        icon="mdi-bell"
        variant="outlined"
        @click="menu = !menu"
        v-bind="props"></cc-button>
      <v-badge v-if="itemCount"
        color="warning"
        class="ml-1 mb-4"
        dot />
    </template>
    <cloud-notification-list />
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { UserStore } from '@/stores'
import CloudNotificationList from './_components/CloudNotificationList.vue'

const menu = ref(false)
const store = UserStore()
const itemCount = computed(() => store.CloudNotifications.length)
</script>
