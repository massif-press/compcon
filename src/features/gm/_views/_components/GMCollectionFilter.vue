<template>
  <v-dialog v-model="filterDialog"
    max-width="70vw">
    <template #activator="{ props }">
      <v-badge :model-value="filters.length > 0"
        dot
        color="secondary">
        <cc-button icon="mdi-filter-variant"
          color="primary"
          variant="elevated"
          size="small"
          v-bind="props" />
      </v-badge>
    </template>
    <v-card>
      <v-toolbar density="compact"
        color="primary">
        <v-toolbar-title>{{ $t('gm.filter.filters') }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon
          @click="filterDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <div>
          <v-row>
            <v-col v-if="items.length > 0 && (items as any)[0].StatController">
              <div class="heading h3">{{ $t('gm.filter.stats') }}</div>
              <v-divider />

              <v-row>
                <v-col>
                  <div class="text-caption text-disabled"><i>{{ $t('gm.filter.showItemsWith') }}</i></div>
                  <v-chip v-for="f in statFilters.filter((f) => !filters.some((x) => x === f))"
                    :key="`show-stat-${f}`"
                    size="small"
                    class="mr-1 mb-1"
                    @click="$emit('add-filter', f)">
                    <v-icon start
                      size="x-small"
                      icon="mdi-eye" />
                    {{ f }}
                  </v-chip>
                </v-col>
                <v-col>
                  <div class="text-caption text-disabled"><i>{{ $t('gm.filter.hideItemsWith') }}</i></div>
                  <v-chip v-for="f in statFilters.filter((f) => filters.some((x) => x === f))"
                    :key="`hide-stat-${f}`"
                    size="small"
                    class="mr-1 mb-1"
                    @click="$emit('remove-filter', f)">
                    <v-icon start
                      size="x-small"
                      icon="mdi-eye-off" />
                    {{ f }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-col>

            <v-col v-if="items.length > 0 && (items as any)[0].NarrativeController">
              <div class="heading h3">{{ $t('gm.filter.labels') }}</div>
              <v-divider />
              <v-row>
                <v-col>
                  <div class="text-caption text-disabled"><i>{{ $t('gm.filter.showItemsWith') }}</i></div>
                  <v-chip v-for="f in labelFilters.filter((f) => !filters.some((x) => x === f))"
                    :key="`show-label-${f}`"
                    size="small"
                    class="mr-1 mb-1"
                    @click="$emit('add-filter', f)">
                    <v-icon start
                      size="x-small"
                      icon="mdi-eye" />
                    {{ f }}
                  </v-chip>
                </v-col>
                <v-col>
                  <div class="text-caption text-disabled"><i>{{ $t('gm.filter.hideItemsWith') }}</i></div>
                  <v-chip v-for="f in labelFilters.filter((f) => filters.some((x) => x === f))"
                    :key="`hide-label-${f}`"
                    size="small"
                    class="mr-1 mb-1"
                    @click="$emit('remove-filter', f)">
                    <v-icon start
                      size="x-small"
                      icon="mdi-eye-off" />
                    {{ f }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn block
                variant="plain"
                color="accent"
                size="x-small"
                @click="all('show', 'stats')">
                {{ $t('gm.filter.showAll') }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn block
                variant="plain"
                color="accent"
                size="x-small"
                @click="all('hide', 'stats')">
                {{ $t('gm.filter.hideAll') }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn block
                variant="plain"
                color="accent"
                size="x-small"
                @click="all('show', 'labels')">
                {{ $t('gm.filter.showAll') }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn block
                variant="plain"
                color="accent"
                size="x-small"
                @click="all('hide', 'labels')">
                {{ $t('gm.filter.hideAll') }}
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <div class="text-right mt-6">
          <v-btn color="accent"
            variant="tonal"
            size="small"
            @click="$emit('set-filters', [])">
            <v-icon left
              start>mdi-filter-off</v-icon>
            {{ $t('gm.filter.clearAllFilters') }}
          </v-btn>
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="accent"
          variant="text"
          @click="filterDialog = false">{{ $t('common.dismiss') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  items: any[]
  filters: any[]
}>()

const emit = defineEmits<{
  'add-filter': []
  'remove-filter': []
  'set-filters': []
}>()

const filterDialog = ref(false)
const filterSets = ref(['Stats', 'Labels'])

const labelFilters = computed(() => {
      if (!props.items.length || !(props.items as any)[0].NarrativeController) return [];
      return [
        ...new Set(
          props.items
            .flatMap((item: any) => item.NarrativeController.Labels)
            .map((x: any) => x.title)
        ),
      ];
    })
const statFilters = computed(() => {
      if (!props.items.length || !(props.items as any)[0].StatController) return [];
      return [
        ...new Set(
          props.items
            .flatMap((item: any) => item.StatController.DisplayKeys)
            .map((x: any) => x.title)
        ),
      ];
    })

function all(action: 'show' | 'hide', type: 'stats' | 'labels') {
      let f = [] as any[];
      if (type === 'stats') {
        if (action === 'show') {
          f = props.filters.filter((x) => !statFilters.value.some((y) => y === x));
        } else {
          f.push(...statFilters.value);
        }
      } else {
        if (action === 'show') {
          f = props.filters.filter((x) => !labelFilters.value.some((y) => y === x));
        } else {
          f.push(...labelFilters.value);
        }
      }
      emit('set-filters', f);
    }
</script>
