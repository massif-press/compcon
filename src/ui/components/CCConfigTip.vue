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

<script lang="ts">
  export default {
    props: {
      actor: {
        type: Object,
        required: true,
      },
    },
    computed: {
      mobile(): boolean {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0
      },
    },
  }
</script>
