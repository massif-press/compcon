<template>
  <v-btn-toggle
    divided
    variant="plain"
    border
    density="compact"
    tile
    style="width: 100%; height: 30px">
    <v-menu offset-y :close-on-content-click="false" max-width="500px">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" size="small" style="width: 50%">
          <v-tooltip text="Content Packs" location="top">
            <template v-slot:activator="{ props }">
              <span v-bind="props">
                <v-icon size="x-large" icon="cc:content_manager" start />
                <v-chip size="x-small">
                  <b>{{ lcpFilter.length }}</b>
                </v-chip>
              </span>
            </template>
          </v-tooltip>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <v-list>
            <v-list-item tile title="Select All">
              <template v-slot:prepend>
                <v-checkbox-btn
                  :model-value="lcpFilter.length === lcps.length"
                  :indeterminate="lcpFilter.length > 0 && lcpFilter.length < lcps.length"
                  @click="$emit('set-all')" />
              </template>
            </v-list-item>
            <v-divider />
            <v-list-item tile v-for="lcp in lcps" :title="<any>lcp">
              <template v-slot:prepend>
                <v-checkbox-btn
                  :value="lcp"
                  :model-value="modelValue"
                  @update:modelValue="$emit('update:modelValue', $event)" />
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-menu>

    <v-menu offset-y :close-on-content-click="false" width="500px">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" size="small" style="width: 50%">
          <v-tooltip text="Item Filters" location="top">
            <template v-slot:activator="{ props }">
              <span v-bind="props">
                <v-icon size="large" icon="mdi-filter" start />
                <v-chip size="x-small">
                  <b>{{ otherFilterCount }}</b>
                </v-chip>
              </span>
            </template>
          </v-tooltip>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <cc-item-filter
            ref="itemFilter"
            :item-type="itemType"
            @set-filters="setFilters($event)" />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn @click="clearFilters">Clear Filters</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-btn-toggle>
</template>

<script lang="ts">
export default {
  name: 'browser-view-toggle',
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
    lcps: {
      type: Array,
      required: true,
    },
    itemType: {
      type: String,
      required: true,
    },
    lcpFilter: {
      type: Array,
      required: true,
    },
    otherFilter: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue', 'set-all', 'set-filters'],
  computed: {
    otherFilterCount() {
      let count = 0;
      for (const filter of Object.keys(this.otherFilter)) {
        count += Object.keys(this.otherFilter[filter]).length;
      }
      return count;
    },
  },
  methods: {
    setFilters(filters: any) {
      this.$emit('set-filters', filters);
    },
    clearFilters() {
      (this.$refs.itemFilter as any).clear();
      this.$emit('set-filters', {});
    },
  },
};
</script>
