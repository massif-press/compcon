<template>
  <v-row density="compact"
    justify="space-around"
    class="mx-4">
    <v-col cols="12">
      <v-select v-model="tagFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="mdi-tag"
        chips
        clearable
        variant="outlined"
        label="Tags"
        :items="systemTags"
        multiple
        item-title="Name"
        item-value="ID"
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="<any>systemTypeFilter"
        class="px-2"
        density="compact"
        prepend-icon="cc:system"
        variant="outlined"
        hide-details
        label="System Type"
        :items="systemTypes"
        chips
        clearable
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="llFilter"
        density="compact"
        hide-details
        class="px-2"
        prepend-icon="cc:pilot"
        clearable
        chips
        multiple
        variant="outlined"
        label="License Level"
        :items="[0, 1, 2, 3]"
        @update:modelValue="updateFilters()" />
    </v-col>
  </v-row>
  <v-divider class="my-4" />
  <v-row dense
    align="center"
    justify="center">
    <v-col cols="auto">
      <v-icon icon="cc:system_point" />
    </v-col>
    <v-col cols="auto">
      <span class="text-button">SP Cost</span>
    </v-col>
    <v-col cols="auto">
      <v-btn-toggle v-model="spType"
        color="accent"
        border
        divided
        density="compact"
        style="height: 30px"
        @update:modelValue="updateFilters()">
        <v-btn value="less"
          size="small">Less Than</v-btn>
        <v-btn value="eq"
          size="small">Equal To</v-btn>
        <v-btn value="greater"
          size="small">Greater Than</v-btn>
      </v-btn-toggle>
    </v-col>
  </v-row>
  <v-row dense
    align="center"
    justify="center">
    <v-col cols="auto">
      <v-text-field v-model="sp"
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
        @update:modelValue="updateFilters()" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { SystemType } from '@/class';

export default {
  name: 'mech-system-filter',
  props: {
    activeFilters: { type: Object, default: () => ({}) },
    systemTags: { type: Array, default: () => [] },
  },
  data: () => ({
    tagFilter: [] as string[],
    systemTypeFilter: [] as SystemType[],
    llFilter: [] as number[],
    sp: 0,
    spType: '',
  }),
  emits: ['set-filters'],
  mounted() {
    const f = this.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.Tags) this.tagFilter = f.Tags;
    if (f.Type) this.systemTypeFilter = f.Type[0] ?? [];
    if (f.LicenseLevel) this.llFilter = f.LicenseLevel;
    const spKey = Object.keys(f).find(k => k.startsWith('SP_'));
    if (spKey) { this.spType = spKey.slice(3); this.sp = f[spKey]; }
  },
  computed: {
    systemTypes(): string[] {
      return Object.keys(SystemType).map((k) => SystemType[k as any]).filter((k) => k !== 'Integrated').sort() as string[];
    },
  },
  methods: {
    clear() {
      this.tagFilter = [];
      this.systemTypeFilter = [];
      this.sp = 0;
      this.spType = '';
    },
    updateFilters() {
      const fObj = {} as any;
      if (this.spType && !Number.isNaN(this.sp)) fObj[`SP_${this.spType}`] = this.sp;
      if (this.tagFilter && this.tagFilter.length) fObj.Tags = this.tagFilter;
      if (this.systemTypeFilter && this.systemTypeFilter.length) fObj.Type = [this.systemTypeFilter];
      if (this.llFilter && this.llFilter.length) fObj.LicenseLevel = this.llFilter.map((x) => Number(x));
      this.$emit('set-filters', fObj);
    },
  },
};
</script>
