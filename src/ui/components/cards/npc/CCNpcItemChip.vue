<template>
  <v-chip label :color="item.Feature.Color" dark>
    <item-menu
      v-if="!readonly && !active"
      :item="item"
      :active="active"
      @remove-feature="$emit('remove-feature', $event)"
      @add-reaction="$emit('add-reaction', $event)"
      @recalc="$emit('recalc')"
    />
    <v-menu
      open-on-hover
      open-delay="500ms"
      offset-y
      top
      close-on-click
      close-on-content-click
    >
      <template v-slot:activator="{ props }">
        <div v-bind="props">
          <v-icon>cc:{{ $_.kebabCase(item.ItemType) }}</v-icon>
          <span class="heading h3 px-2 mt-n1">{{ item.Name }}</span>
          <v-icon
            v-html-safe="
              item.Tier === 'custom'
                ? 'mdi-star-circle-outline'
                : 'cc:rank-' + item.Tier
            "
          />
        </div>
      </template>
      <cc-npc-item-card :item="item" readonly active />
    </v-menu>
  </v-chip>
</template>

<script lang="ts">
import ItemMenu from './cards/_ItemMenu.vue';

export default {
  name: 'cc-npc-item-chip',
  components: { ItemMenu },
  props: {
    item: {
      type: Object,
      required: true,
    },
    active: {
      type: Boolean,
    },
    readonly: {
      type: Boolean,
    },
  },
};
</script>
