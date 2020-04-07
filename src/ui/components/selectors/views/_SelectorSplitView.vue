<template>
  <div class="mt-n2">
    <v-row dense>
      <v-col cols="3" class="pt-2 ml-n6">
        <v-list dense class="side-fixed">
          <v-list-item-group v-model="selected" color="accent">
            <v-list-item v-for="i in items" :key="`${i.ID}_sidebar'`" :value="i.ID" dense>
              <v-list-item-icon>
                <cc-logo v-if="i.Manufacturer" :source="i.Manufacturer" class="mb-n1" />
                <v-icon v-else>cci-trait</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="ml-n6 mt-n1">
                <v-list-item-title
                  class="heading h3 stark--text font-weight-bold"
                  style="font-size: 15px"
                >
                  {{ i.Name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col class="pl-7 mr-7">
        <div
          v-if="!selectedItem"
          class="heading h2 light-panel--text text-center"
          style="margin-top:calc(50vh - 150px);"
        >
          NO SELECTION
        </div>
        <div v-else class="side-fixed">
          <div class="heading h1 mt-2 stark--text">{{ selectedItem.Name }}</div>
          <v-divider class="mt-4 mb-1" />
          <cc-item-card :item="selectedItem" />
          <div class="text-center mt-3">
            <v-btn color="secondary" x-large tile @click="$emit('equip', selectedItem)">
              Equip {{ selectedItem.Name }}
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'selector-split-view',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    selected: null,
  }),
  computed: {
    selectedItem() {
      return this.items.find(x => x.ID === this.selected)
    },
  },
})
</script>

<style scoped>
.side-fixed {
  height: calc(100vh - 220px);
  overflow-y: scroll;
  top: 125px;
  padding-bottom: 35px;
}
</style>
