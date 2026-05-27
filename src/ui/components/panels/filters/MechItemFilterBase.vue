<template>
  <v-row density="compact"
    justify="space-around"
    class="mx-4">
    <slot />
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
        @update:modelValue="emitFilters()" />
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
        @update:modelValue="emitFilters()">
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
    <v-col cols="auto"
      :class="showReset ? 'text-center' : ''">
      <v-text-field v-model="sp"
        type="number"
        variant="outlined"
        style="width: 150px"
        density="compact"
        hide-details
        class="hide-input-spinners"
        prepend-icon="mdi-minus"
        append-icon="mdi-plus"
        @click:prepend="sp > 0 ? sp-- : sp; emitFilters();"
        @click:append="sp++; emitFilters();"
        @update:modelValue="emitFilters()" />
      <v-btn v-if="showReset"
        size="x-small"
        variant="plain"
        @click="sp = 0; spType = ''; emitFilters();">
        Reset
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'mech-item-filter-base',
  props: {
    activeFilters: { type: Object, default: () => ({}) },
    showReset: { type: Boolean, default: false },
  },
  emits: ['sp-ll-change'],
  data: () => ({
    llFilter: [] as number[],
    sp: 0,
    spType: '',
  }),
  mounted() {
    const f = this.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.LicenseLevel) this.llFilter = f.LicenseLevel;
    const spKey = Object.keys(f).find((k: string) => k.startsWith('SP_'));
    if (spKey) { this.spType = spKey.slice(3); this.sp = f[spKey]; }
  },
  methods: {
    clear() {
      this.llFilter = [];
      this.sp = 0;
      this.spType = '';
    },
    emitFilters() {
      const fObj: any = {};
      if (this.spType && !Number.isNaN(this.sp)) fObj[`SP_${this.spType}`] = this.sp;
      if (this.llFilter && this.llFilter.length) fObj.LicenseLevel = this.llFilter.map((x) => Number(x));
      this.$emit('sp-ll-change', fObj);
    },
  },
};
</script>
