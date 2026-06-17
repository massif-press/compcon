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
        :label="$t('ui.fields.licenseLevel')"
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
      <span class="text-button">{{ $t('ui.filter.spCost') }}</span>
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
          size="small">{{ $t('ui.filter.lessThan') }}</v-btn>
        <v-btn value="eq"
          size="small">{{ $t('ui.filter.equalTo') }}</v-btn>
        <v-btn value="greater"
          size="small">{{ $t('ui.filter.greaterThan') }}</v-btn>
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
        {{ $t('common.reset') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineOptions({ name: 'mech-item-filter-base' })

const props = withDefaults(defineProps<{
  activeFilters?: object
  showReset?: boolean
}>(), {
  activeFilters: () => ({}),
  showReset: false
})

const emit = defineEmits<{
  'sp-ll-change': []
}>()

const llFilter = ref([] as number[])
const sp = ref(0)
const spType = ref('')

function clear() {
      llFilter.value = [];
      sp.value = 0;
      spType.value = '';
    }
function emitFilters() {
      const fObj: any = {};
      if (spType.value && !Number.isNaN(sp.value)) fObj[`SP_${spType.value}`] = sp.value;
      if (llFilter.value && llFilter.value.length) fObj.LicenseLevel = llFilter.value.map((x) => Number(x));
      emit('sp-ll-change', fObj);
    }

onMounted(() => {
const f = props.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.LicenseLevel) llFilter.value = f.LicenseLevel;
    const spKey = Object.keys(f).find((k: string) => k.startsWith('SP_'));
    if (spKey) { spType.value = spKey.slice(3); sp.value = f[spKey]; }
})
</script>
