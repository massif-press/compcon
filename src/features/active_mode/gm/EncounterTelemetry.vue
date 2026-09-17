<template>
  <div class="cc-fill cc-fill-root">
    <div
      class="cc-fill"
      style="overflow: hidden"
    >
      <v-layout style="height: 100%; flex: 1 1 auto; min-height: 0">
        <cc-panel-toggle
          v-model="showNav"
          side="left"
          :open-offset="mobile ? 322 : 349"
          :closed-offset="0"
        />

        <v-navigation-drawer
          v-model="showNav"
          :width="mobile ? 320 : 350"
        >
          <div class="pa-3">
            <v-select
              v-model="groupBy"
              :items="groupByItems"
              :label="$t('active.gmTelemetry.groupBy')"
              density="compact"
              variant="outlined"
              class="mb-2"
              hide-details
            />
            <v-select
              v-model="folder"
              :items="folderItems"
              :label="$t('active.gmTelemetry.folder')"
              density="compact"
              variant="outlined"
              class="mb-2"
              hide-details
            />
            <v-select
              v-model="label"
              :items="labelItems"
              :label="$t('active.gmTelemetry.label')"
              density="compact"
              variant="outlined"
              class="mb-2"
              hide-details
            />
            <v-select
              v-model="campaign"
              :items="campaignItems"
              :label="$t('active.gmTelemetry.campaign')"
              density="compact"
              variant="outlined"
              class="mb-2"
              hide-details
            />

            <v-divider class="my-3" />

            <div class="text-cc-overline mb-2">{{ $t('active.charts.dataSet') }}</div>
            <v-select
              v-model="focusIds"
              :items="focusItems"
              :label="$t('active.charts.selectEncounter')"
              density="compact"
              variant="outlined"
              multiple
              clearable
              chips
              closable-chips
              hide-details
            />

            <cc-dialog
              :close-on-click="false"
              icon="mdi-database-remove"
              color="error"
              :title="$t('active.gmTelemetry.deleteTitle')"
            >
              <template #activator="{ open }">
                <v-btn
                  block
                  size="small"
                  variant="tonal"
                  color="error"
                  class="mt-2"
                  prepend-icon="mdi-database-remove"
                  @click="open()"
                >
                  {{ $t('active.gmTelemetry.manageData') }}
                </v-btn>
              </template>
              <template #default="{ close }">
                <div
                  v-if="!archives.length"
                  class="text-disabled text-center pa-4"
                >
                  {{ $t('active.gmTelemetry.empty') }}
                </div>
                <v-checkbox
                  v-for="a in archives"
                  :key="a.ID"
                  v-model="deleteIds"
                  :value="a.ID"
                  :label="`${a.Name} (${new Date(a.Start).toLocaleDateString()})`"
                  density="compact"
                  hide-details
                />
                <v-divider class="my-2" />
                <div class="text-right">
                  <v-menu :close-on-content-click="false">
                    <template #activator="{ props }">
                      <v-btn
                        color="error"
                        variant="tonal"
                        :disabled="!deleteIds.length"
                        v-bind="props"
                      >
                        {{ $t('active.gmTelemetry.deleteSelected', { count: deleteIds.length }) }}
                      </v-btn>
                    </template>
                    <cc-confirmation
                      cancellable
                      :content="$t('active.gmTelemetry.deleteConfirm', { count: deleteIds.length })"
                      @confirm="deleteSelected(close)"
                    />
                  </v-menu>
                </div>
              </template>
            </cc-dialog>

            <div class="text-caption text-disabled mt-4">
              {{
                $t('active.gmTelemetry.scopeSummary', {
                  archives: scoped.length,
                  groups: groups.length,
                })
              }}
            </div>
          </div>

          <template #append>
            <v-divider />
            <div class="pa-2">
              <v-btn
                block
                tile
                flat
                size="small"
                color="primary"
                prepend-icon="mdi-arrow-left"
                to="/active-mode"
              >
                {{ $t('common.back') }}
              </v-btn>
            </div>
          </template>
        </v-navigation-drawer>

        <v-main style="overflow-y: auto">
          <v-container fluid>
            <div
              v-if="!groups.length"
              class="text-center text-disabled text-cc-overline pa-8"
            >
              {{ $t('active.gmTelemetry.empty') }}
            </div>

            <v-row
              v-else
              dense
            >
              <v-col
                v-for="spec in charts"
                :key="spec.id"
                class="chart-col"
                cols="12"
                :md="expanded.has(spec.id) ? 12 : 6"
                :xl="expanded.has(spec.id) ? 12 : 4"
              >
                <cc-chart
                  :title="spec.title"
                  :subtitle="spec.subtitle"
                  :type="spec.type"
                  :data="spec.data"
                  :options="spec.options"
                  :table="spec.table"
                  :height="
                    expanded.has(spec.id) ? (spec.height ?? 260) * 1.5 : (spec.height ?? 260)
                  "
                  expandable
                  :expanded="expanded.has(spec.id)"
                  @toggle-expand="toggleExpand(spec.id)"
                />
              </v-col>
            </v-row>

            <v-expansion-panels v-if="groups.length">
              <v-expansion-panel
                v-for="g in groups"
                :key="g.key"
              >
                <v-expansion-panel-title>
                  <span class="heading h3">{{ g.label }}</span>
                  <v-spacer />
                  <span class="text-caption text-disabled mr-4">
                    {{
                      $t('active.gmTelemetry.groupSummary', {
                        appearances: g.encounters,
                        dealt: g.rollup.totalDealt,
                        taken: g.rollup.totalTaken,
                      })
                    }}
                  </span>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <rollup-display :rollup="g.rollup" />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-container>
        </v-main>
      </v-layout>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useDisplay } from 'vuetify'
  import { EncounterStore } from '@/features/gm/store/encounter_store'
  import { groupStreams } from '@/classes/components/combat/log/grouping'
  import type { GroupBy } from '@/classes/components/combat/log/grouping'
  import type { EncounterArchive } from '@/classes/encounter/EncounterArchive'
  import RollupDisplay from '@/features/active_mode/runner/gm/EncounterPanels/_components/_RollupDisplay.vue'
  import CcChart from '@/features/active_mode/_components/charts/CcChart.vue'
  import CcPanelToggle from '@/ui/components/buttons/CCPanelToggle.vue'
  import { useChartTheme } from '@/features/active_mode/_components/charts/chartBase'
  import { gmCharts } from '@/features/active_mode/_components/charts/gmCharts'

  const { t } = useI18n()
  const { smAndDown: mobile } = useDisplay()

  const showNav = ref(true)
  const groupBy = ref<GroupBy>('class')
  const folder = ref('')
  const label = ref('')
  const campaign = ref('')

  const archives = computed(
    () =>
      EncounterStore().ArchivedEncounters.filter(
        a => !a.SaveController.IsDeleted
      ) as EncounterArchive[]
  )

  const groupByItems = [
    { value: 'class', title: t('active.gmTelemetry.byClass') },
    { value: 'template', title: t('active.gmTelemetry.byTemplate') },
    { value: 'origin', title: t('active.gmTelemetry.byRosterEntry') },
    { value: 'actor', title: t('active.gmTelemetry.byCombatant') },
    { value: 'type', title: t('active.gmTelemetry.byType') },
  ]

  function folderOf(a: EncounterArchive): string {
    return (a.EncounterData as any)?.folder?.folder ?? ''
  }

  function labelsOf(a: EncounterArchive): string[] {
    return ((a.EncounterData as any)?.narrative?.labels ?? []).map((l: any) => l.title)
  }

  const folderItems = computed(() => [
    { value: '', title: t('active.gmTelemetry.allFolders') },
    ...[...new Set(archives.value.map(folderOf).filter(Boolean))].map(f => ({
      value: f,
      title: f,
    })),
  ])

  const labelItems = computed(() => [
    { value: '', title: t('active.gmTelemetry.allLabels') },
    ...[...new Set(archives.value.flatMap(labelsOf).filter(Boolean))].map(l => ({
      value: l,
      title: l,
    })),
  ])

  // Stream is a builder: it re-sorts every event on each access, so map once and feed both readers
  const streams = computed(() => archives.value.map(a => ({ archive: a, stream: a.Stream })))

  const campaignItems = computed(() => [
    { value: '', title: t('active.gmTelemetry.allCampaigns') },
    ...[...new Set(streams.value.map(s => s.stream.campaignId).filter(Boolean))].map(c => ({
      value: c as string,
      title: c as string,
    })),
  ])

  const scoped = computed(() =>
    streams.value.filter(
      ({ archive }) =>
        (!folder.value || folderOf(archive) === folder.value) &&
        (!label.value || labelsOf(archive).includes(label.value))
    )
  )

  const allGroups = computed(() =>
    groupStreams(
      scoped.value.map(s => s.stream),
      { campaignId: campaign.value || undefined }
    )
  )

  const groups = computed(() => allGroups.value.filter(g => g.by === groupBy.value))

  const chartTheme = useChartTheme()

  // the per-encounter charts need archives in focus rather than the whole scope
  const focusIds = ref<string[]>([])
  const focusItems = computed(() =>
    scoped.value.map(({ archive }) => ({
      value: archive.ID,
      title: `${archive.Name} (${new Date(archive.Start).toLocaleDateString()})`,
    }))
  )

  watch(
    focusItems,
    items => {
      const available = items.map(i => i.value)
      const kept = focusIds.value.filter(id => available.includes(id))
      focusIds.value = kept.length || !available.length ? kept : [available[0]]
    },
    { immediate: true }
  )

  const focusStreams = computed(() =>
    scoped.value.filter(s => focusIds.value.includes(s.archive.ID)).map(s => s.stream)
  )

  const charts = computed(() =>
    gmCharts(
      chartTheme.value,
      t,
      groups.value,
      allGroups.value,
      scoped.value.map(s => s.stream),
      focusStreams.value
    )
  )

  const deleteIds = ref<string[]>([])

  async function deleteSelected(close: () => void) {
    const store = EncounterStore()
    for (const a of archives.value.filter(x => deleteIds.value.includes(x.ID))) {
      await store.RemoveEncounterArchive(a)
    }
    deleteIds.value = []
    close()
  }

  const expanded = ref(new Set<string>())

  function toggleExpand(id: string) {
    const next = new Set(expanded.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    expanded.value = next
  }
</script>

<style scoped>
  .chart-col {
    transition:
      flex-basis 0.3s ease,
      max-width 0.3s ease;
  }
</style>
