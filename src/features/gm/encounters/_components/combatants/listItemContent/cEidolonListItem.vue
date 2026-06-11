<template>
  <c-list-item-base :item="item" :readonly="readonly">
    <template #title>
      <v-icon size="large" :icon="item.actor.Icon" class="mt-n1" />
      {{ item.actor.Name }} &mdash; {{ $t('gm.itemCard.tierShort', { tier: item.actor.Tier }) }}
      <cc-slashes />
      {{ $t('gm.itemCard.classLabel', { class: item.actor.Class }) }}
    </template>

    <v-chip v-for="l in item.actor.Layers"
      :key="l.ID"
      label
      prepend-icon="mdi-layers"
      class="mx-1 my-1">
      {{ l.Layer.Name }}
    </v-chip>
  </c-list-item-base>
</template>

<script setup lang="ts">
import cListItemBase from './cListItemBase.vue'

withDefaults(defineProps<{
  item: Record<string, any>
  readonly?: boolean
}>(), { readonly: false })
</script>
