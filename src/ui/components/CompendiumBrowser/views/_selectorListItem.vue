<template>
  <div v-if="item">
    <div
      v-if="!hideTitle"
      class="heading h1 my-n2"
      :class="highlighted ? 'text-secondary' : 'text-primary'"
    >
      {{ item.Name }}
    </div>

    <cc-bond-info v-if="item.ItemType === 'Bond'" :bond="item" />

    <div v-else-if="useVCard" variant="outlined" color="subtle" class="mx-4">
      <v-card-text class="px-2 pt-1 pb-3">
        <div v-html-safe="item.Description" class="body-text" />
      </v-card-text>
    </div>

    <div v-else-if="item.ItemType === 'Status'" class="pb-2">
      <v-row align="center">
        <v-col cols="auto">
          <v-icon v-if="item.Icon" size="80" color="accent" :icon="item.Icon" /> </v-col
        ><v-col>
          <div class="flavor-text" v-text="item.StatusType" />
          <v-divider class="my-1" />
          <div v-html-safe="item.Effects" class="mb-0 text-stark body-text"
        /></v-col>
      </v-row>
    </div>

    <cc-talent v-else-if="item.ItemType === 'Talent'" :talent="item" />

    <cc-item-card v-else :item="item" charts />
  </div>
  <div v-else style="height: 100px">
    <div class="heading h2 light-text-panel text-center" style="margin-top: calc(50vh - 150px)">
      NO SELECTION
    </div>
  </div>
</template>

<script lang="ts">
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
