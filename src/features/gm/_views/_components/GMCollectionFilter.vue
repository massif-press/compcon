<template>
  <v-dialog v-model="filterDialog" max-width="70vw">
    <template v-slot:activator="{ props }">
      <v-badge :model-value="filters.length > 0" dot color="secondary">
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
                    @click="$emit('add-filter', f)"
                    ><v-icon start size="x-small" icon="mdi-eye" /> {{ f }}</v-chip
                  >
                </v-col>
                <v-col>
                  <div class="text-caption text-disabled"><i>Hide items with:</i></div>
                  <v-chip
                    v-for="f in statFilters.filter((f) => filters.some((x) => x === f))"
                    size="small"
                    class="mr-1 mb-1"
                    @click="$emit('remove-filter', f)"
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
                    @click="$emit('add-filter', f)"
                    ><v-icon start size="x-small" icon="mdi-eye" /> {{ f }}</v-chip
                  >
                </v-col>
                <v-col>
                  <div class="text-caption text-disabled"><i>Hide items with:</i></div>
                  <v-chip
                    v-for="f in labelFilters.filter((f) => filters.some((x) => x === f))"
                    size="small"
                    class="mr-1 mb-1"
                    @click="$emit('remove-filter', f)"
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
          <v-btn color="accent" variant="tonal" size="small" @click="$emit('set-filters', [])"
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
</template>

<script lang="ts">
export default {
  name: 'gm-collection-filter',
  props: {
    items: { type: Array, required: true },
    filters: { type: Array, required: true },
  },
  data: () => ({
    filterDialog: false,
    filterSets: ['Stats', 'Labels'],
  }),
  emits: ['add-filter', 'remove-filter', 'set-filters'],
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
  },
  methods: {
    all(action: 'show' | 'hide', type: 'stats' | 'labels') {
      let f = [] as any[];
      if (type === 'stats') {
        if (action === 'show') {
          f = this.filters.filter((x) => !this.statFilters.some((y) => y === x));
        } else {
          f.push(...this.statFilters);
        }
      } else {
        if (action === 'show') {
          f = this.filters.filter((x) => !this.labelFilters.some((y) => y === x));
        } else {
          f.push(...this.labelFilters);
        }
      }
      this.$emit('set-filters', f);
    },
  },
};
</script>
