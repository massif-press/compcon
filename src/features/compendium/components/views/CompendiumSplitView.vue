<template>
  <v-row density="compact">
    <v-col cols="auto" class="pa-0" style="max-width: 25vw">
      <v-list density="compact" class="side-fixed" color="primary">
        <v-list-item
          v-for="item in items"
          :value="(item as any).ID"
          nav
          density="compact"
          @click="selected = (item as any).ID"
        >
          <template #prepend>
            <v-icon class="ml-2 mr-1" :icon="getIcon(item)" />
          </template>
          <template #title>
            <b v-text="(item as any).Name" class="heading" />
          </template>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col class="pa-0">
      <div
        v-if="!selectedItem"
        class="heading h2 light-text-panel text-center"
        style="margin-top: calc(50vh - 150px)"
      >
        NO SELECTION
      </div>
      <div v-else class="side-fixed px-4">
        <div class="heading h1 text-stark">
          {{ (selectedItem as any).Name }}
        </div>
        <cc-item-card :item="selectedItem" />
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'compendium-split-view',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    selected: undefined as any,
  }),
  computed: {
    selectedItem() {
      return this.items.find((x: any) => x.ID === this.selected);
    },
  },
  methods: {
    getIcon(item: any) {
      if (item.IsExotic) return 'mdi-star';
      else if (item.Source && item.Manufacturer) return item.Manufacturer.Icon;
      else return 'cc:trait';
    },
  },
};
</script>

<style scoped>
.side-fixed {
  height: calc(100vh - 150px);
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
