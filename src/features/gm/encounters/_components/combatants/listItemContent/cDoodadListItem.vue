<template>
  <c-list-item-base :item="item" :readonly="readonly">
    <template #title>
      <v-icon size="30" icon="mdi-cube-outline" class="mt-n1" />
      {{ item.actor.Name }}
    </template>

    <div class="text-caption">
      <stat-chips :stat-controller="item.actor.StatController" />
    </div>
  </c-list-item-base>
</template>

<script setup lang="ts">
import StatChips from '../../../../_views/_components/gmItemCards/_subcomponents/statChips.vue'
import cListItemBase from './cListItemBase.vue'

withDefaults(defineProps<{
  item: Record<string, any>
  readonly?: boolean
}>(), { readonly: false })
</script>
