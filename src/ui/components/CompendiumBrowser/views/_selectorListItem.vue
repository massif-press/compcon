<template>
  <div v-if="item">
    <v-row
      v-if="!hideTitle"
      no-gutters
      class="heading h2 px-2 bg-surface"
      style="font-size: calc(14px + 1vw)"
      :class="highlighted ? 'text-secondary' : 'text-accent'">
      <v-col>
        <v-icon v-if="item.Icon" :icon="item.Icon" />
        {{ item.Name }}
      </v-col>
      <v-col v-if="item.Manufacturer" cols="auto">
        <v-icon
          v-if="item.Manufacturer.Icon"
          :icon="item.Manufacturer.Icon"
          :color="item.Manufacturer.Color" />
      </v-col>
    </v-row>

    <cc-bond-info v-if="item.ItemType === 'Bond'" :bond="item" />

    <cc-talent v-else-if="item.ItemType === 'Talent'" :talent="item" hide-change />

    <cc-panel v-else color="surface">
      <div v-if="useCard">
        <div v-if="item.Detail" v-html-safe="item.Detail" class="body-text" />
        <div v-else v-html-safe="item.Description" class="body-text" />
      </div>

      <div v-else-if="item.ItemType === 'Status'" class="pb-2">
        <v-row align="center">
          <v-col v-if="!mobile" cols="auto">
            <v-icon v-if="item.Icon" size="80" color="accent" :icon="item.Icon" />
          </v-col>
          <v-col>
            <div class="flavor-text" v-text="item.StatusType" />
            <v-divider class="my-1" />
            <p v-html-safe="item.Effects" />
          </v-col>
        </v-row>
      </div>

      <cc-item-card v-else :item="item" charts />
    </cc-panel>

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
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    useCard(): boolean {
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
