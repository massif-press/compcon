<template>
  <span>
    <v-tooltip v-if="item.LcpName"
      location="top"
      :close-delay="300"
      :max-width="350">
      <template #activator="{ props }">
        <v-icon v-bind="props"
          icon="cc:compendium"
          class="fade-select"
          :color="getColor" />
      </template>
      <v-icon v-if="item.InLcp"
        icon="cc:compendium"
        color="exotic"
        class="pb-1"
        start />
      <b>{{ item.LcpName }}</b>
    </v-tooltip>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'cc-brew-info' })

const props = defineProps<{
  item: object
  color?: string
}>()

const getColor = computed(() => {
      if (props.item.InLcp) return 'exotic';
      return props.color;
    })
</script>
