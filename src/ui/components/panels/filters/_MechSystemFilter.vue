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
        deletable-chips
        small-chips
        @change="updateFilters()"
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
        deletable-chips
        variant="outlined"
        label="Tags"
        :items="tags"
        multiple
        small-chips
        item-text="Name"
        item-value="ID"
        @change="updateFilters()"
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
        deletable-chips
        small-chips
        @change="updateFilters()"
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
        deletable-chips
        variant="outlined"
        label="From Content Pack"
        :items="lcps"
        multiple
        small-chips
        @change="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="4" class="text-center">
      <v-icon icon="cc:system-point" />
      <span class="text-button">SP Cost</span>
      <v-btn-toggle
        v-model="spType"
        color="accent"
        class="ml-1 py-1"
        @change="updateFilters()"
      >
        <v-btn value="less" small text>Less Than</v-btn>
        <v-btn value="eq" small text>Equal To</v-btn>
        <v-btn value="greater" small text>Greater Than</v-btn>
      </v-btn-toggle>
      <v-row no-gutters justify="center">
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
            append-outer-icon="mdi-plus"
            @click:prepend="
              sp > 0 ? sp-- : sp;
              updateFilters();
            "
            @click:append-outer="
              sp++;
              updateFilters();
            "
            @change="updateFilters()"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Tag, SystemType, Manufacturer } from '@/class';

import { CompendiumStore } from '@/stores';

const nameSort = function (a, b): number {
  if (a.text.toUpperCase() < b.text.toUpperCase()) return -1;
  if (a.text.toUpperCase() > b.text.toUpperCase()) return 1;
  return 0;
};

export default {
  name: 'frame-filter',
  data: () => ({
    sourceFilter: [],
    tagFilter: [],
    systemTypeFilter: [],
    sp: '',
    spType: '',
    lcpFilter: [],
  }),
  computed: {
    manufacturers(): Manufacturer[] {
      return this.$CompendiumStore
        .getItemCollection('Manufacturers')
        .map((x) => ({ text: x.Name, value: x.ID }))
        .sort(nameSort);
    },
    systemTypes(): SystemType[] {
      return Object.keys(SystemType)
        .map((k) => SystemType[k as any])
        .filter((k) => k !== 'Integrated')
        .sort() as SystemType[];
    },
    tags(): Tag[] {
      return this.$_.uniqBy(
        [].concat(
          this.$CompendiumStore
            .getItemCollection('MechSystems')
            .flatMap((x) => x.Tags)
            .filter((x) => !x.FilterIgnore && !x.IsHidden)
        ),
        'ID'
      );
    },
    lcps(): string[] {
      return CompendiumStore().Frames.map((x) => x.LcpName);
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
      if (this.spType && parseInt(this.sp) !== NaN)
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
