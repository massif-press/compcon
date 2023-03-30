<template>
  <div class="mt-n3">
    <v-row density="compact">
      <v-select
        v-model="selectedItem"
        variant="outlined"
        density="compact"
        hide-details
        :items="items"
        :item-text="
          (item) => {
            return `${item.Source ? item.Source + ' ' : ''}${item.Name}`;
          }
        "
        class="my-2"
        return-object
      />
    </v-row>
    <v-row density="compact">
      <v-col>
        <div
          v-if="!selectedItem"
          class="heading h2 light-text-panel text-center"
          style="margin-top: calc(50vh - 150px)"
        >
          NO SELECTION
        </div>
        <div v-else class="side-fixed">
          <div class="heading h2 text-stark">{{ selectedItem.Name }}</div>
          <v-divider class="mt-4 mb-1" />
          <cc-item-card :item="selectedItem" />
          <v-divider class="my-3" />
          <v-btn
            v-if="equipmentAdd"
            color="secondary"
            large
            tile
            block
            @click="$emit('add', selectedItem)"
          >
            Add {{ selectedItem.Name }}
          </v-btn>
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
export default {
  name: 'compendium-split-view',
  props: {
    items: {
      type: Array,
      required: true,
    },
    equipmentAdd: { type: Boolean },
    spDisable: { type: Boolean },
    spIgnore: { type: Boolean },
    sp: { type: Number, required: false, default: 0 },
  },
  data: () => ({
    selectedItem: null,
  }),
};
</script>
