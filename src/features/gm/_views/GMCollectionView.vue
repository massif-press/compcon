<template>
  <v-container>
    <v-card variant="tonal">
      <v-toolbar class="px-2 rounded-b-0">
        <v-row dense align="center">
          <v-col cols="auto">
            <div class="heading h2">{{ title }} <slot name="tooltip" /></div>
          </v-col>
          <v-col cols="4" class="pl-4">
            <v-autocomplete
              v-model="search"
              :placeholder="`Search ${title}`"
              :items="items"
              item-text="Name"
              item-value="Name"
              density="compact"
              hide-details
              clearable
              prepend-icon="mdi-magnify"
            />
          </v-col>
          <v-col cols="3" class="ml-auto">
            <v-select
              v-model="grouping"
              :items="groupings"
              label="Group By"
              hide-details
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="sorting"
              :items="sortings"
              label="Sort By"
              hide-details
              variant="outlined"
              density="compact"
            />
          </v-col>
        </v-row>
      </v-toolbar>
      <v-row justify="space-between">
        <v-col cols="auto">
          <v-btn-toggle v-model="view" density="compact" mandatory tile class="rounded-t-0">
            <v-btn value="list">
              <v-icon color="accent">mdi-view-list</v-icon>
            </v-btn>
            <v-btn value="big-grid">
              <v-icon color="accent">mdi-view-grid</v-icon>
            </v-btn>
            <v-btn value="grid">
              <v-icon color="accent">mdi-grid</v-icon>
            </v-btn>
            <v-btn value="table">
              <v-icon color="accent">mdi-table</v-icon>
            </v-btn>
          </v-btn-toggle>
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

    <v-footer fixed>
      <v-btn color="secondary" @click="$emit('add-new')">
        <v-icon size="large" start icon="mdi-plus" />
        Add New {{ itemType }}
      </v-btn>
      <v-btn size="small" variant="tonal" color="accent" class="mx-4" @click="$emit('import-item')">
        <v-icon start icon="mdi-download" />
        Import {{ itemType }}
      </v-btn>
      <v-spacer />
      <v-btn
        size="small"
        variant="tonal"
        color="accent"
        class="mx-4"
        @click="($refs as any).print.show()"
        ><v-icon start icon="mdi-queue-first-in-last-out" />Organize</v-btn
      >
      <v-spacer />
      <v-btn
        size="small"
        variant="tonal"
        color="accent"
        class="mx-4"
        @click="($refs as any).print.show()"
        ><v-icon start icon="mdi-printer" />Print Multiple</v-btn
      >
      <cc-solo-dialog ref="print" icon="mdi-print" no-confirm large title="Print Multiple">
        <cc-mass-print :items="items" />
      </cc-solo-dialog>
      <v-btn size="small" variant="tonal" color="error" @click="($refs as any).delete.show()"
        ><v-icon start icon="mdi-delete" />Delete Multiple</v-btn
      >
      <cc-solo-dialog ref="delete" icon="mdi-delete" no-confirm large title="Delete Multiple">
        <cc-mass-delete :items="items" />
      </cc-solo-dialog>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import ItemCardGrid from '../_views/ItemCardGrid.vue';

export default {
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
      if (!this.search) return this.items;
      return this.items.filter((x: any) => (x as any).Name.includes(this.search));
    },
  },
  data: () => ({
    search: '',
    view: 'list',
    sorting: 'Name',
    grouping: 'None',
  }),
};
</script>
