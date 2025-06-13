<template>
  <c-list-item-base :item="item" :readonly="readonly">
    <template #title>
      <v-icon size="large" :icon="item.actor.Icon" class="mt-n1" />
      {{ item.actor.Name }} &mdash; T{{ item.actor.Tier }}
      <cc-slashes />
      CLASS {{ item.actor.Class }}
    </template>

    <v-chip v-for="l in item.actor.Layers" label prepend-icon="mdi-layers" class="mx-1 my-1">
      {{ l.Layer.Name }}
    </v-chip>
  </c-list-item-base>
</template>

<script lang="ts">
import cListItemBase from './cListItemBase.vue';

export default {
  name: 'gm-eidolon-list-item',
  components: { cListItemBase },
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
};
</script>
