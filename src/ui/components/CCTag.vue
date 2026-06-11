<template>
  <v-tooltip max-width="350px" location="top" :open-on-click="mobile" :open-on-hover="!mobile">
    <template #activator="{ props }">
      <v-chip
        v-bind="props"
        v-show="!tag.IsHidden"
        class="ma-1 cc-tag-clip pl-4 pr-2"
        :color="getColor"
        tile
        variant="elevated"
        :size="size">
        <v-icon v-if="tag.err" icon="mdi-label-off" />
        <v-icon v-else start icon="mdi-label" />
        <span v-if="tag.err">{{ $t('ui.widget.missingData') }}</span>
        <span v-else>{{ tag.GetName(bonus, tier).toUpperCase() }}</span>
      </v-chip>
    </template>
    <div class="heading h3">{{ tag.GetName(bonus, tier) }}</div>
    <v-divider class="my-2" />
    <div v-html-safe="tag.GetDescription(bonus, tier)" />
  </v-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const { smAndDown: mobile } = useDisplay()

interface Props {
  size?: string
  outlined?: boolean
  color?: string
  tag: Record<string, any>
  pilot?: object | null
  bonus?: number
  tier?: number
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  pilot: null,
  bonus: 0,
  tier: 1,
})

const getColor = computed(() => {
  return props.tag.err ? 'error' : props.tag.IsExotic ? 'exotic' : props.color
})
</script>

<style scoped>
.cc-tag-clip {
  clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
  padding-right: 16px;
}
</style>
