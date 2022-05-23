<template>
  <v-container>
    <v-card flat>
      <v-toolbar>
        <v-row dense align="center">
          <v-col cols="auto">
            <span class="heading h2">{{ title }}</span>
          </v-col>
          <v-col cols="4" class="pl-4">
            <v-autocomplete
              v-model="search"
              :placeholder="`Search ${title}`"
              :items="items"
              item-text="Name"
              item-value="Name"
              dense
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="3" class="ml-auto">
            <v-select
              v-model="grouping"
              :items="groupings"
              label="Group By"
              hide-details
              outlined
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="sorting"
              :items="sortings"
              label="Sort By"
              hide-details
              outlined
              dense
            />
          </v-col>
        </v-row>
      </v-toolbar>
      <v-row justify="space-between">
        <v-col cols="auto">
          <v-btn-toggle v-model="view" mandatory tile>
            <v-btn small icon value="big-grid">
              <v-icon color="accent">mdi-view-grid</v-icon>
            </v-btn>
            <v-btn small icon value="grid">
              <v-icon color="accent">mdi-grid</v-icon>
            </v-btn>
            <v-btn small icon value="list">
              <v-icon color="accent">mdi-view-list</v-icon>
            </v-btn>
            <v-btn small icon value="table">
              <v-icon color="accent">mdi-table</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="auto" align-self="end">
          <v-btn small color="primary" @click="$refs.print.show()">Print Multiple</v-btn>
          <cc-solo-dialog ref="print" icon="mdi-print" no-confirm large title="Print Multiple">
            <cc-mass-print :items="items" />
          </cc-solo-dialog>
        </v-col>
        <v-col cols="auto" align-self="end" class="mr-3">
          <v-btn small color="error" @click="$refs.delete.show()">Delete Multiple</v-btn>
          <cc-solo-dialog ref="delete" icon="mdi-delete" no-confirm large title="Delete Multiple">
            <cc-mass-delete :items="items" />
          </cc-solo-dialog>
        </v-col>
      </v-row>
      <v-card-text>
        <item-card-grid
          :item-type="itemType"
          :items="searchedItems"
          :big="view === 'big-grid'"
          :list="view === 'list'"
          :table="view === 'table'"
          :grouping="grouping"
          :sorting="sorting"
          @open="$emit('open', $event)"
        />
      </v-card-text>
    </v-card>
    <v-row justify="center" align="center" class="my-4" dense>
      <v-col cols="8">
        <v-btn x-large block color="primary" @click="$emit('add-new')">
          <v-icon large left>mdi-plus</v-icon>
          Add New {{ itemType }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" align="center" class="my-4" dense>
      <v-col cols="8">
        <v-btn x-large block color="primary" @click="$emit('add-new')">
          <v-icon large left>mdi-plus</v-icon>
          Import {{ itemType }}
        </v-btn>
      </v-col>
    </v-row>
    <v-footer fixed>
      <v-btn small to="/gm">
        <v-icon left>mdi-chevron-left</v-icon>
        Return to GM Menu
      </v-btn>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import ItemCardGrid from '../_views/ItemCardGrid.vue'

export default Vue.extend({
  name: 'characters-roster',
  components: { ItemCardGrid },
  props: {
    items: { type: Array, required: true },
    itemType: { type: String, required: true },
    title: { type: String, required: true },
    groupings: { type: Array, required: true, default: ['None'] },
    sortings: { type: Array, required: true, default: ['Name'] },
  },
  computed: {
    searchedItems() {
      if (!this.search) return this.items
      return this.items.filter(x => x.Name.includes(this.search))
    },
  },
  data: () => ({
    search: '',
    view: 'big-grid',
    sorting: 'Name',
    grouping: 'None',
  }),
})
</script>
