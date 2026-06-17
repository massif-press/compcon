<template>
  <cc-modal ref="dialog"
    :color="item.Color ? item.Color : 'primary'"
    :title="`${item.Name}`"
    :icon="item.Icon"
    shrink>
    <template #activator="{ open }">
      <cc-button :color="item.Color ? item.Color : 'primary'"
        :class="density === 'compact' ? '' : 'ma-1'"
        style="margin: 1px"
        :block="block"
        :prepend-icon="itemIcon"
        :size="size"
        @click="open">
        {{ truncate(item.Name) }}
        <span v-if="!hideType && item.ItemType === 'Frame'">&nbsp;{{ $t('common.frame') }}</span>
        <cc-broken-reference v-if="!hideLink"
          :item="item"
          end />
      </cc-button>
    </template>

    <div style="position: absolute; top: 43px; right: 5px;">
      <cc-lcp-info :item="item" />
    </div>

    <template v-if="!mobile"
      #toolbar-items>
      <cc-chip v-if="item.Source"
        :icon="item.Manufacturer?.Icon || item.Icon || ''"
        :title="item.Source || ''"
        :label="startCase(item.ItemType)"
        :color="item.Manufacturer?.Color || item.Color || ''" />
    </template>

    <v-card-text class="pt-2"
      :class="wide && 'px-12'">
      <cc-item-card :item="item" />
    </v-card-text>

    <item-card-link :item="item" />

    <div style="height: 30px" />
  </cc-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { startCase } from 'lodash-es'
import ItemCardLink from './items/_components/ItemCardLink.vue'

const { smAndDown: mobile, lgAndUp: wide } = useDisplay()

const props = withDefaults(defineProps<{
  item: Record<string, any>
  hideType?: boolean
  hideLink?: boolean
  block?: boolean
  size?: string
  density?: string
  smallBtn?: boolean
}>(), {
  size: 'small',
  density: '',
})

const itemIcon = computed(() => {
  if (props.item.IsExotic) return 'mdi-star'
  if (props.hideType) return undefined
  return props.item.Icon
})

function truncate(str: string): string {
  if (props.block) return str
  if (str.length > 26) return str.substring(0, 24) + '…'
  return str
}
</script>
