<template>
  <v-card flat
    border
    tile>
    <v-list v-if="store.CloudNotifications.length"
      density="compact">
      <v-list-item v-for="(notification, idx) in store.CloudNotifications"
        :key="`notification-${idx}`"
        :title="notification.text"
        :prepend-icon="notification.type === 'error' ? 'mdi-alert-circle' : 'mdi-information'"
        :color="notification.type === 'error' ? 'error' : ''">
        <template #append>
          <v-tooltip location="top">
            <template #activator="{ props }">
              <cc-button v-bind="props"
                icon="mdi-close"
                size="small"
                variant="text"
                class="ml-2"
                @click="store.removeCloudNotification(idx)" />
            </template>
            <span>{{ $t('nav.common.dismiss') }}</span>
          </v-tooltip>
        </template>
      </v-list-item>
      <v-btn size="x-small"
        variant="tonal"
        block
        tile
        @click="store.clearCloudNotifications()">
        {{ cn.dismissAll }}
      </v-btn>
    </v-list>
    <v-card-text v-else>
      <i class="text-disabled">{{ cn.noRecentUpdates }}</i>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { UserStore } from '@/stores'
import { useNavStrings } from '@/features/nav/useNavStrings'
const { section } = useNavStrings()

const store = UserStore()
const cn = section('cloudNotifications')
</script>
