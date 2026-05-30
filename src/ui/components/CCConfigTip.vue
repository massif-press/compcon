<template>
  <v-tooltip
    v-if="actor.LcpConfig"
    :open-on-hover="!mobile"
    :open-on-click="mobile"
    max-width="350px"
    location="top"
  >
    <template #activator="{ props }">
      <cc-chip
        v-bind="props"
        icon="mdi-list-status"
        color="exotic"
        :label="actor.LcpConfig.packList.length"
        size="x-small"
      ></cc-chip>
    </template>
    <template #default>
      <div>
        <strong>{{ actor.LcpConfig.name }}</strong>
      </div>
      <v-divider class="my-1" />
      <div class="text-caption">
        {{ actor.LcpConfig.packList.map(x => x.packName).join(' // ') }}
      </div>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  actor: object
}>()

const mobile = computed(() => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0
      })
</script>
