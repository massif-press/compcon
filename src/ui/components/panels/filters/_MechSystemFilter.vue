<template>
  <v-row density="compact" justify="space-around" class="mx-4">
    <v-col cols="12" md="4">
      <v-select
        v-model="sourceFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="mdi-factory"
        variant="outlined"
        label="From Manufacturer"
        :items="manufacturers"
        chips
        clearable
        @update:modelValue="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-select
        v-model="tagFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="mdi-tag"
        chips
        clearable
        variant="outlined"
        label="Tags"
        :items="tags"
        multiple
        item-text="Name"
        item-value="ID"
        @update:modelValue="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-select
        v-model="systemTypeFilter"
        class="px-2"
        density="compact"
        prepend-icon="cc:system"
        variant="outlined"
        label="System Type"
        :items="systemTypes"
        chips
        clearable
        @update:modelValue="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-select
        v-model="lcpFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:compendium"
        chips
        clearable
        variant="outlined"
        label="From Content Pack"
        :items="lcps"
        multiple
        @update:modelValue="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="6" class="text-center">
      <v-row dense align="center">
        <v-col cols="auto">
          <v-icon icon="cc:system_point" />
        </v-col>
        <v-col cols="auto">
          <span class="text-button">SP Cost</span>
        </v-col>
        <v-col cols="auto">
          <v-btn-toggle
            v-model="spType"
            color="accent"
            class="ml-1 py-1"
            @update:modelValue="updateFilters()"
          >
            <v-btn value="less" size="small">Less Than</v-btn>
            <v-btn value="eq" size="small">Equal To</v-btn>
            <v-btn value="greater" size="small">Greater Than</v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="auto">
          <v-text-field
            v-model="sp"
            type="number"
            variant="outlined"
            style="width: 150px"
            density="compact"
            hide-details
            class="hide-input-spinners"
            prepend-icon="mdi-minus"
            append-icon="mdi-plus"
            @click:prepend="
              sp > 0 ? sp-- : sp;
              updateFilters();
            "
            @click:append="
              sp++;
              updateFilters();
            "
            @update:modelValue="updateFilters()"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Tag, SystemType, Manufacturer } from '@/class';

import { CompendiumStore } from '@/stores';
import _ from 'lodash';

const nameSort = function (a, b): number {
  if (a.title.toUpperCase() < b.title.toUpperCase()) return -1;
  if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
  return 0;
};

export default {
  name: 'frame-filter',
  data: () => ({
    sourceFilter: [],
    tagFilter: [],
    systemTypeFilter: [] as SystemType[],
    sp: '',
    spType: '',
    lcpFilter: [],
  }),
  emits: ['set-filters'],
  computed: {
    manufacturers(): Manufacturer[] {
      return CompendiumStore()
        .getItemCollection('Manufacturers')
        .map((x) => ({ title: x.Name, value: x.ID }))
        .sort(nameSort);
    },
    systemTypes(): SystemType[] {
      return Object.keys(SystemType)
        .map((k) => SystemType[k as any])
        .filter((k) => k !== 'Integrated')
        .sort() as SystemType[];
    },
    tags(): Tag[] {
      return _.uniqBy(
        [].concat(
          CompendiumStore()
            .getItemCollection('MechSystems')
            .flatMap((x) => x.Tags)
            .filter((x) => !x.FilterIgnore && !x.IsHidden)
        ),
        'ID'
      );
    },
    lcps(): string[] {
      return CompendiumStore().lcpNames;
    },
  },
  methods: {
    clear() {
      this.sourceFilter = [];
      this.tagFilter = [];
      this.systemTypeFilter = [];
      this.sp = '';
      this.spType = '';
      this.lcpFilter = [];
    },
    updateFilters() {
      const fObj = {} as any;
      if (this.lcpFilter && this.lcpFilter.length)
        fObj.LcpName = [this.lcpFilter];
      if (this.spType && !Number.isNaN(parseInt(this.sp)))
        fObj[`SP_${this.spType}`] = parseInt(this.sp);
      if (this.sourceFilter && this.sourceFilter.length)
        fObj.Source = [this.sourceFilter];
      if (this.tagFilter && this.tagFilter.length) fObj.Tags = this.tagFilter;
      if (this.systemTypeFilter && this.systemTypeFilter.length)
        fObj.Type = [this.systemTypeFilter];
      this.$emit('set-filters', fObj);
    },
  },
};
</script>
