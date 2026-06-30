<template>
  <v-card variant="tonal"
    flat
    tile>
    <v-toolbar v-if="!hideTitle"
      density="compact"
      height="50"
      color="primary"
      class="pl-3">
      <div style="min-width: 200px">
        <cc-short-string-editor v-if="!readonly"
          justify="start"
          :placeholder="table.Title"
          @set="table.Title = $event">
          <span class="heading h3">{{ table.Title }}</span>
        </cc-short-string-editor>
        <div v-else
          class="heading h3">{{ table.Title }}</div>
      </div>
      <div v-if="!dense && !readonly">
        <v-checkbox-btn v-model="table.GmOnly"
          hide-details>
          <template #label>
            {{ $t('ui.fields.gmOnly') }}
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-icon class="fade-select"
                  size="x-small"
                  end
                  icon="mdi-information-outline"
                  v-bind="props" />
              </template>
              <div>{{ $t('ui.rollTable.gmOnlyTooltip') }}</div>
            </v-tooltip>
          </template>
        </v-checkbox-btn>
      </div>
      <v-spacer />
      <v-row v-if="!readonly"
        no-gutters
        align="center">
        <v-col v-if="!dense"
          cols="auto"
          class="heading pl-3 pr-3">{{ $t('common.roll_noun') }}</v-col>
        <v-col cols="auto">
          <v-menu>
            <template #activator="{ props }">
              <v-btn icon
                v-bind="props"
                variant="tonal"
                size="x-small"
                class="mt-n1">
                <span class="heading h3">{{ table.Mult || '#' }}</span>
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <v-btn v-for="n in 5"
                  :key="`mult-${n}`"
                  icon
                  variant="tonal"
                  color="accent"
                  size="x-small"
                  class="mx-2"
                  @click="table.Mult = n">
                  <span class="heading h3">{{ n }}</span>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>

        <v-col cols="auto"
          class="heading"
          style="margin: 0px 2px 0 2px">{{ $t('ui.rollTable.d')
          }}</v-col>
        <v-col cols="auto">
          <v-menu>
            <template #activator="{ props }">
              <v-btn icon
                v-bind="props"
                variant="tonal"
                size="x-small"
                class="mt-n1">
                <span class="heading h3">{{ table.Die || '#' }}</span>
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <v-btn v-for="n in dice"
                  :key="`dice-${n}`"
                  icon
                  variant="tonal"
                  color="accent"
                  size="x-small"
                  class="mx-2"
                  @click="table.Die = n">
                  <span class="heading h3">{{ n }}</span>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>
        <v-spacer />
        <v-col cols="auto"
          class="heading pl-3 pr-1">{{ $t('ui.rollTable.step') }}</v-col>
        <v-col cols="auto">
          <v-text-field v-model="step"
            type="number"
            variant="outlined"
            style="max-width: 60px"
            density="compact"
            class=""
            hide-details />
        </v-col>

        <v-spacer />
        <v-col cols="auto">
          <v-menu offset-x
            bottom>
            <template #activator="{ props }">
              <v-btn size="small"
                :icon="dense"
                variant="tonal"
                v-bind="props">
                <v-icon :start="!dense">mdi-reload</v-icon>
                <span v-if="!dense">{{ $t('ui.rollTable.rebuild') }}</span>
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                {{ $t('ui.rollTable.rebuildConfirm') }}
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn small
                  color="error"
                  @click="generate">{{ $t('ui.rollTable.confirmRebuild')
                  }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-col>
        <v-col v-if="!noDelete"
          cols="auto">
          <v-menu offset-x
            left>
            <template #activator="{ props }">
              <v-btn small
                icon
                color="error"
                variant="plain"
                v-bind="props">
                <v-icon icon="mdi-delete" />
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                {{ $t('ui.rollTable.deleteConfirm') }}
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn small
                  color="error"
                  @click="$emit('delete')">{{ $t('common.confirmDeletion')
                  }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
    </v-toolbar>

    <v-card-text v-if="showDescription"
      v-html-safe="table.Description"
      class="text-text py-3" />

    <v-table class="pr-3 py-1 rounded-0">
      <tr v-for="(r, i) in table.Results"
        :key="i"
        :class="`${print ? 'py-2' : ''} ${(i as number) % 2 !== 0 ? 'light-panel' : ''}`">
        <td v-if="!mobile"
          class="text-center heading h3 px-3"
          style="width: 75px; line-height: 18px;">
          <span v-if="r.max === -1">{{ $t('ui.rollTable.multipleOnes') }}</span>
          <span v-else-if="r.min === r.max">{{ r.max }}</span>
          <span v-else>{{ r.min }} - {{ r.max }}</span>
        </td>
        <td>
          <v-textarea v-if="!print && !readonly"
            v-model="r.result"
            density="compact"
            hide-details
            rows="2"
            variant="outlined"
            auto-grow
            class="my-1" />
          <v-card v-else
            class="mb-1"
            :class="dense ? 'pa-2' : 'pa-3'">
            <v-card v-if="mobile"
              class="text-center text-text"
              flat
              tile
              color="background">
              <strong v-if="r.max === -1">{{ $t('ui.rollTable.multipleOnes') }}</strong>
              <strong v-else-if="r.min === r.max">{{ r.max }}</strong>
              <strong v-else>{{ r.min }} - {{ r.max }}</strong>
            </v-card>
            <p v-html-safe="r.result" />
          </v-card>
        </td>
      </tr>
    </v-table>
  </v-card>
</template>

<script setup lang="ts">
import type { RollableTable } from '@/classes/narrative/elements/RollableTable'
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'

const _display = useDisplay()

const props = withDefaults(defineProps<{
  table: RollableTable
  color?: string
  print?: boolean
  noDelete?: boolean
  readonly?: boolean
  density?: string
  hideTitle?: boolean
  showDescription?: boolean
}>(), {
  color: 'primary',
  density: '',
  hideTitle: false,
  showDescription: false
})

const editDialog = ref(false)
const step = ref(2)
const dice = ref([2, 3, 6, 8, 10, 12, 20])
const mults = ref([1, 2, 3, 4, 5])

const mobile = computed(() => {
  return _display.mdAndDown.value;
})
const dense = computed(() => {
  return props.density === 'compact';
})

function generate() {
  props.table.setArray(parseInt(step.value as any));
}
</script>
