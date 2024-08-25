<template>
  <div v-if="item">
    <div
      v-if="!hideTitle"
      class="heading h2"
      style="font-size: 2.3em"
      :class="highlighted ? 'text-secondary' : 'text-accent'">
      {{ item.Name }}
    </div>

    <cc-bond-info v-if="item.ItemType === 'Bond'" :bond="item" />

    <div v-else-if="useVCard" variant="outlined" color="subtle" class="mx-4">
      <v-card-text class="px-2 pt-1 pb-3">
        <div v-if="item.Detail" v-html-safe="item.Detail" class="body-text" />
        <div v-else v-html-safe="item.Description" class="body-text" />
      </v-card-text>
    </div>

    <div v-else-if="item.ItemType === 'Status'" class="pb-2">
      <v-row align="center">
        <v-col cols="auto">
          <v-icon v-if="item.Icon" size="80" color="accent" :icon="item.Icon" />
        </v-col>
        <v-col>
          <div class="flavor-text" v-text="item.StatusType" />
          <v-divider class="my-1" />
          <div v-html-safe="item.Effects" class="mb-0 text-stark body-text" />
        </v-col>
      </v-row>
    </div>

    <cc-talent v-else-if="item.ItemType === 'Talent'" :talent="item" hide-change />

    <cc-item-card v-else :item="item" charts />

    <item-card-link :item="item" />

    <div v-if="selectable">
      <v-btn
        block
        color="secondary"
        prepend-icon="mdi-plus-box"
        rounded="0"
        @click="$emit('select', item)">
        Select {{ item.Name }}
      </v-btn>
    </div>
  </div>
  <div v-else style="height: 100px">
    <div class="heading h2 light-text-panel text-center" style="margin-top: calc(50vh - 150px)">
      NO SELECTION
    </div>
  </div>
</template>

<script lang="ts">
import ItemCardLink from '../../cards/items/_components/ItemCardLink.vue';

export default {
  name: 'selector-list-item',
  props: {
    item: {
      type: Object,
      required: false,
    },
    highlighted: {
      type: Boolean,
    },
    hideTitle: {
      type: Boolean,
    },
    selectable: {
      type: Boolean,
    },
  },
  emits: ['select'],
  components: {
    ItemCardLink,
  },
  computed: {
    useVCard(): boolean {
      switch (this.item && this.item.ItemType) {
        case 'Background':
        case 'Skill':
        case 'Tag':
          return true;
        default:
          return false;
      }
    },
  },
};
</script>
