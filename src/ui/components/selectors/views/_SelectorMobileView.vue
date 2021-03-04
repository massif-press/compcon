<template>
  <div class="mt-n3">
    <v-row dense>
      <v-select
        v-model="selectedItem"
        outlined
        dense
        hide-details
        :items="items"
        :item-text="
          item => {
            return `${item.Source ? item.Source + ' ' : ''}${item.Name}`
          }
        "
        class="my-2"
        return-object
      />
    </v-row>
    <v-row dense>
      <v-col>
        <div
          v-if="!selectedItem"
          class="heading h2 light-panel--text text-center"
          style="margin-top:calc(50vh - 150px);"
        >
          NO SELECTION
        </div>
        <div v-else class="side-fixed">
          <div class="heading h2 stark--text">{{ selectedItem.Name }}</div>
          <v-divider class="mt-4 mb-1" />
          <cc-item-card :item="selectedItem" />
          <v-divider class="my-3" />
          <v-btn
            color="secondary"
            large
            tile
            block
            :disabled="spDisable && selectedItem.SP > sp && !spIgnore"
            @click="$emit('equip', selectedItem)"
          >
            Equip {{ selectedItem.Name }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'compendium-split-view',
  props: {
    items: {
      type: Array,
      required: true,
    },
    spDisable: { type: Boolean },
    spIgnore: { type: Boolean },
    sp: { type: Number, required: false, default: 0 },
  },
  data: () => ({
    selectedItem: null,
  }),
})
</script>
