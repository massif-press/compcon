<template>
  <v-container>
    <v-card variant="tonal">
      <v-toolbar class="px-2 rounded-b-0">
        <v-row dense align="center">
          <v-col cols="auto">
            <div class="heading h2">{{ title }} <slot name="tooltip" /></div>
          </v-col>
          <v-col class="pl-4">
            <v-autocomplete
              v-model="search"
              :placeholder="`Search ${title}`"
              :items="items"
              item-title="Name"
              item-value="Name"
              density="compact"
              hide-details
              clearable
              prepend-icon="mdi-magnify" />
          </v-col>
          <v-col cols="3" class="ml-auto">
            <v-select
              v-model="grouping"
              :items="groupings"
              label="Group By"
              hide-details
              variant="outlined"
              density="compact"
              :disabled="view === 'table'" />
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="sorting"
              :items="sortings"
              label="Sort By"
              hide-details
              variant="outlined"
              density="compact"
              :disabled="view === 'table'" />
          </v-col>
          <v-col cols="auto">
            <v-dialog v-model="filterDialog" max-width="70vw">
              <template v-slot:activator="{ props }">
                <v-badge v-model="filters.length" dot color="secondary">
                  <v-btn icon color="primary" variant="elevated" size="small" v-bind="props">
                    <v-icon size="23" icon="mdi-filter-variant" />
                  </v-btn>
                </v-badge>
              </template>
              <v-card>
                <v-toolbar density="compact" color="primary">
                  <v-toolbar-title>Filters </v-toolbar-title>
                  <v-spacer />
                  <v-btn icon @click="filterDialog = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <div>
                    <v-row>
                      <v-col v-if="(items as any)[0].StatController">
                        <div class="heading h3">Stats</div>
                        <v-divider />

                        <v-row>
                          <v-col>
                            <div class="text-caption text-disabled"><i>Show items with:</i></div>
                            <v-chip
                              v-for="f in statFilters.filter((f) => !filters.some((x) => x === f))"
                              size="small"
                              class="mr-1 mb-1"
                              @click="filters.push(f)"
                              ><v-icon start size="x-small" icon="mdi-eye" /> {{ f }}</v-chip
                            >
                          </v-col>
                          <v-col>
                            <div class="text-caption text-disabled"><i>Hide items with:</i></div>
                            <v-chip
                              v-for="f in statFilters.filter((f) => filters.some((x) => x === f))"
                              size="small"
                              class="mr-1 mb-1"
                              @click="filters.splice(filters.indexOf(f), 1)"
                              ><v-icon start size="x-small" icon="mdi-eye-off" />{{ f }}</v-chip
                            >
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col v-if="(items as any)[0].NarrativeController">
                        <div class="heading h3">Labels</div>
                        <v-divider />
                        <v-row>
                          <v-col>
                            <div class="text-caption text-disabled"><i>Show items with:</i></div>
                            <v-chip
                              v-for="f in labelFilters.filter((f) => !filters.some((x) => x === f))"
                              size="small"
                              class="mr-1 mb-1"
                              @click="filters.push(f)"
                              ><v-icon start size="x-small" icon="mdi-eye" /> {{ f }}</v-chip
                            >
                          </v-col>
                          <v-col>
                            <div class="text-caption text-disabled"><i>Hide items with:</i></div>
                            <v-chip
                              v-for="f in labelFilters.filter((f) => filters.some((x) => x === f))"
                              size="small"
                              class="mr-1 mb-1"
                              @click="filters.splice(filters.indexOf(f), 1)"
                              ><v-icon start size="x-small" icon="mdi-eye-off" />{{ f }}</v-chip
                            >
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-btn
                          block
                          variant="plain"
                          color="accent"
                          size="x-small"
                          @click="all('show', 'stats')"
                          >Show All</v-btn
                        >
                      </v-col>
                      <v-col>
                        <v-btn
                          block
                          variant="plain"
                          color="accent"
                          size="x-small"
                          @click="all('hide', 'stats')"
                          >Hide All</v-btn
                        >
                      </v-col>
                      <v-col>
                        <v-btn
                          block
                          variant="plain"
                          color="accent"
                          size="x-small"
                          @click="all('show', 'labels')"
                          >Show All</v-btn
                        >
                      </v-col>
                      <v-col>
                        <v-btn
                          block
                          variant="plain"
                          color="accent"
                          size="x-small"
                          @click="all('hide', 'labels')"
                          >Hide All</v-btn
                        >
                      </v-col>
                    </v-row>
                  </div>
                  <div class="text-right mt-6">
                    <v-btn color="accent" variant="tonal" size="small" @click="filters = []"
                      ><v-icon left start>mdi-filter-off</v-icon>Clear All Filters</v-btn
                    >
                  </div>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="accent" text @click="filterDialog = false">Dismiss</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
          :items="filteredItems"
          :search="search"
          :big="view === 'big-grid'"
          :list="view === 'list'"
          :table="view === 'table'"
          :grouping="grouping"
          :sorting="sorting"
          @open="$emit('open', $event)" />
      </v-card-text>
      <div v-if="hidden" class="text-right pa-2 text-disabled">
        <i>{{ hidden }} items hidden by filter</i>
      </div>
    </v-card>

    <v-footer fixed>
      <v-spacer />
      <v-btn color="secondary" @click="$emit('add-new')">
        <v-icon size="large" start icon="mdi-plus" />
        Add New {{ itemType }}
      </v-btn>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import ItemCardGrid from '../_views/ItemCardGrid.vue';
import Organizer from '../_components/Organizer.vue';

export default {
  name: 'gm-collection-view',
  components: { ItemCardGrid, Organizer },
  props: {
    items: { type: Array, required: true },
    itemType: { type: String, required: true },
    title: { type: String, required: true },
    groupings: { type: Array, required: true, default: ['None'] },
    sortings: { type: Array, required: true, default: ['Name'] },
  },
  data: () => ({
    search: '',
    view: 'list',
    sorting: 'Name',
    grouping: 'None',
    filterDialog: false,
    filterSets: ['Stats', 'Labels'],
    filters: [] as any[],
  }),
  computed: {
    labelFilters() {
      return [
        ...new Set(
          this.items
            .flatMap((item: any) => item.NarrativeController.Labels)
            .map((x: any) => x.title)
        ),
      ];
    },
    statFilters() {
      return [
        ...new Set(
          this.items
            .flatMap((item: any) => item.StatController.DisplayKeys)
            .map((x: any) => x.title)
        ),
      ];
    },
    filteredItems() {
      let out = this.items;

      if (this.filters.length) {
        out = out.filter((x: any) => {
          if (x.StatController) {
            const stats = x.StatController.DisplayKeys.map((x: any) => x.title);
            if (this.filters.some((f) => stats.some((s) => s === f))) return false;
          }
          if (x.NarrativeController) {
            const labels = x.NarrativeController.Labels.map((x: any) => x.title);
            if (this.filters.some((f) => labels.some((s) => s === f))) return false;
          }
          return true;
        });
      }
      return out;
    },
    hidden() {
      return this.items.length - this.filteredItems.length;
    },
  },
  methods: {
    all(action: 'show' | 'hide', type: 'stats' | 'labels') {
      if (type === 'stats') {
        if (action === 'show') {
          this.filters = this.filters.filter((x) => !this.statFilters.some((y) => y === x));
        } else {
          this.filters.push(...this.statFilters);
        }
      } else {
        if (action === 'show') {
          this.filters = this.filters.filter((x) => !this.labelFilters.some((y) => y === x));
        } else {
          this.filters.push(...this.labelFilters);
        }
      }
    },
  },
};
</script>
