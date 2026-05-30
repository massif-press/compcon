<template>
  <v-btn-toggle divided
    variant="plain"
    border
    density="compact"
    tile
    style="width: 100%; height: 30px">
    <v-menu offset-y
      :close-on-content-click="false"
      max-width="500px">
      <template #activator="{ props }">
        <v-btn v-bind="props"
          size="small"
          :style="lcpConfigs.length ? 'flex: 1; border-right: none !important' : 'flex: 1'">
          <v-tooltip text="Content Packs"
            location="top">
            <template #activator="{ props }">
              <span v-bind="props">
                <v-icon size="x-large"
                  icon="cc:content_manager"
                  start />
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
            <v-list-item tile
              title="Select All">
              <template #prepend>
                <v-checkbox-btn :model-value="lcpFilter.length === lcps.length"
                  :indeterminate="lcpFilter.length > 0 && lcpFilter.length < lcps.length"
                  @click="$emit('set-all')" />
              </template>
            </v-list-item>
            <v-divider />
            <v-list-item v-for="lcp in lcps"
              :key="`lcp-${lcp}`"
              tile
              :title="<any>lcp">
              <template #prepend>
                <v-checkbox-btn :value="lcp"
                  :model-value="modelValue"
                  @update:model-value="$emit('update:modelValue', $event)" />
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-menu>

    <v-menu v-if="lcpConfigs.length"
      :close-on-content-click="true"
      location="bottom end">
      <template #activator="{ props }">
        <v-btn v-bind="props"
          size="small"
          icon
          style="border-left: none !important">
          <v-tooltip text="Saved Configurations"
            location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                icon="mdi-list-status"
                size="small" />
            </template>
          </v-tooltip>
        </v-btn>
      </template>
      <v-card min-width="200px">
        <v-list density="compact">
          <v-list-subheader>Saved Configurations</v-list-subheader>
          <v-divider />
          <v-list-item v-for="config in lcpConfigs"
            :key="config.id"
            :title="config.name"
            @click="applyLcpConfig(config)">
            <template #append>
              <v-chip size="x-small"
                class="ml-2">
                {{ configMatchCount(config) }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <v-menu offset-y
      :close-on-content-click="false"
      width="500px">
      <template #activator="{ props }">
        <v-btn v-bind="props"
          size="small"
          style="flex: 1">
          <v-tooltip text="Item Filters"
            location="top">
            <template #activator="{ props }">
              <span v-bind="props">
                <v-icon size="large"
                  icon="mdi-filter"
                  start />
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
          <cc-item-filter ref="itemFilter"
            :item-type="itemType"
            :active-filters="otherFilter"
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

<script setup lang="ts">
import { computed, ref } from 'vue'
import CCItemFilter from '../../panels/filters/CCItemFilter.vue'

defineOptions({ name: 'BrowserViewToggle' })

const props = withDefaults(defineProps<{
  modelValue: any[]
  lcps: any[]
  itemType: string
  lcpFilter: any[]
  otherFilter: object
  lcpConfigs?: any[]
}>(), {
  lcpConfigs: () => []
})

const emit = defineEmits<{
  'update:modelValue': []
  'set-all': []
  'set-filters': []
}>()

const itemFilter = ref<any>(null)

const otherFilterCount = computed(() => {
      let count = 0;
      for (const filter of Object.keys(props.otherFilter)) {
        count += Object.keys(props.otherFilter[filter]).length;
      }
      return count;
    })

function applyLcpConfig(config: any) {
      const allowed = new Set(
        config.packList.filter((p: any) => p.allowed).map((p: any) => p.packName)
      );
      allowed.add('Lancer Core Book');
      emit('update:modelValue', (props.lcps as string[]).filter(lcp => allowed.has(lcp)));
    }
function configMatchCount(config: any) {
      const allowed = new Set(
        config.packList.filter((p: any) => p.allowed).map((p: any) => p.packName)
      );
      return (props.lcps as string[]).filter(lcp => allowed.has(lcp)).length;
    }
function setFilters(filters: any) {
      emit('set-filters', filters);
    }
function clearFilters() {
      (itemFilter.value as any).clear();
      emit('set-filters', {});
    }
</script>
