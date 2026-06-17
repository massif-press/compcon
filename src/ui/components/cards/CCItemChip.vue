<template>
  <v-menu :open-on-hover="!mobile"
    :open-on-click="mobile"
    max-width="600px">
    <template #activator="{ props }">
      <cc-button :color="item.Color ? item.Color : 'primary'"
        class="d-inline-block"
        :class="density === 'compact' ? '' : 'ma-1'"
        style="margin: 1px"
        :block="block"
        :prepend-icon="!hideIcon && itemIcon"
        :size="size"
        v-bind="props">
        {{ truncate(item.Name) }}
        <span v-if="!hideType && item.ItemType === 'Frame'">&nbsp;{{ $t('common.frame') }}</span>
        <cc-broken-reference :item="item"
          end />
      </cc-button>
    </template>

    <v-card class="pt-2 pb-4 px-4">
      <cc-item-card :item="item" />
    </v-card>

    <item-card-link :item="item" />
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import ItemCardLink from './items/_components/ItemCardLink.vue'

const { smAndDown: mobile } = useDisplay()

const props = withDefaults(defineProps<{
  item: Record<string, any>
  hideType?: boolean
  hideIcon?: boolean
  block?: boolean
  size?: string
  density?: string
  limit?: number
}>(), {
  size: 'small',
  density: '',
  limit: 26,
})

const itemIcon = computed(() => {
  if (props.item.IsExotic) return 'mdi-star'
  if (props.hideType) return undefined
  return props.item.Icon
})

function truncate(str: string): string {
  if (props.block) return str
  if (str.length > props.limit) return str.substring(0, props.limit - 2) + '…'
  return str
}
</script>
