<template>
  <cc-dialog :title="strings.dialogTitle"
    icon="mdi-wrench"
    :close-on-click="false"
    min-width="60vw"
    max-width="80vw"
    @close="reset">
    <template #activator="{ open }">
      <cc-button block
        size="small"
        color="primary"
        prepend-icon="mdi-wrench"
        :tooltip="strings.buttonTooltip"
        @click="startScan(open)">
        {{ strings.buttonLabel }}
      </cc-button>
    </template>
    <template #default="{ close }">
      <v-card-text class="pa-4">
        <div v-if="scanning || applying"
          class="d-flex flex-column align-center pa-8">
          <v-progress-circular v-if="scanning || !progressTotal"
            indeterminate
            color="warning"
            size="48"
            class="mb-4" />
          <v-progress-linear v-else
            :model-value="progressTotal ? (progress / progressTotal) * 100 : 0"
            color="success"
            height="12"
            rounded
            class="mb-4"
            style="width: 300px" />
          <div class="text-cc-overline text-disabled">
            {{ scanning ? strings.scanning : `Applying fixes (${progress} / ${progressTotal})...`
            }}
          </div>
        </div>

        <template v-else-if="!applying">
          <div v-if="!findings.length"
            class="text-center pa-6">
            <v-icon icon="mdi-check-circle"
              color="success"
              size="48"
              class="mb-2" />
            <div class="text-cc-overline">{{ strings.noIssues }}</div>
          </div>

          <template v-else>
            <cc-alert color="warning"
              variant="outlined"
              :title="strings.experimentalTitle"
              icon="mdi-atom"
              class="mb-4">
              {{ strings.experimentalBody }}<strong>{{ strings.experimentalBodyStrong }}</strong>{{ strings.experimentalBodySuffix }}
            </cc-alert>

            <cc-panel class="mb-4">
              Found {{ fixableCount }} fixable issue{{ fixableCount !== 1 ? 's' : '' }}
              <span v-if="reportOnlyCount"> and {{ reportOnlyCount }} issue{{ reportOnlyCount !== 1
                ? 's' : '' }} requiring manual action</span>.
            </cc-panel>

            <v-table density="compact"
              class="text-left"
              style="max-height: 60vh;">
              <thead>
                <tr class="heading">
                  <th>{{ strings.colCategory }}</th>
                  <th>{{ strings.colItem }}</th>
                  <th>{{ strings.colIssue }}</th>
                  <th class="text-center">{{ strings.colFixable }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(finding, idx) in findings"
                  :key="idx">
                  <td>
                    <v-chip size="x-small"
                      :color="categoryColor(finding.category)"
                      :text="categoryLabel(finding.category)"
                      variant="elevated"
                      flat
                      tile />
                  </td>
                  <td class="text-caption">{{ finding.itemName }}</td>
                  <td class="text-caption">{{ finding.description }}</td>
                  <td class="text-center">
                    <v-icon v-if="finding.canFix"
                      icon="mdi-check"
                      color="success"
                      size="small" />
                    <v-tooltip v-else
                      location="top">
                      <template #activator="{ props }">
                        <v-icon v-bind="props"
                          icon="mdi-alert"
                          color="warning"
                          size="small" />
                      </template>
                      {{ strings.manualActionRequired }}
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </template>
        </template>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-4">
        <cc-button variant="text"
          @click="close">
          {{ strings.cancel }}
        </cc-button>
        <v-spacer />
        <cc-button v-if="fixableCount > 0 && !applying"
          color="success"
          prepend-icon="mdi-wrench-check"
          @click="applyFixes(close)">
          Apply {{ fixableCount }} Fix{{ fixableCount !== 1 ? 'es' : '' }}
        </cc-button>
      </v-card-actions>
    </template>
  </cc-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { runMigrationScan, applyAllFixes, MigrationFinding } from '@/io/MigrationRepair'
import { NAV_STRINGS } from '@/features/nav/strings'

const strings = NAV_STRINGS.migrationRepair

const scanning = ref(false)
const applying = ref(false)
const progress = ref(0)
const progressTotal = ref(0)
const findings = ref<MigrationFinding[]>([])

const fixableCount = computed(() => findings.value.filter(f => f.canFix).length)
const reportOnlyCount = computed(() => findings.value.filter(f => !f.canFix).length)

async function startScan(open: () => void) {
  findings.value = []
  scanning.value = true
  open()
  try {
    findings.value = await runMigrationScan()
  } finally {
    scanning.value = false
  }
}

async function applyFixes(close: () => void) {
  applying.value = true
  progress.value = 0
  progressTotal.value = 0
  await new Promise<void>(resolve => setTimeout(resolve, 0))
  try {
    await applyAllFixes(findings.value, (done, total) => {
      progress.value = done
      progressTotal.value = total
    })
    close()
  } finally {
    applying.value = false
  }
}

function reset() {
  findings.value = []
  scanning.value = false
  applying.value = false
  progress.value = 0
  progressTotal.value = 0
}

function categoryLabel(cat: string): string {
  switch (cat) {
    case 'flavor_description': return strings.catFlavorText
    case 'lcp_origin': return strings.catLcpOrigin
    case 'npc_stats': return strings.catNpcStats
    default: return cat
  }
}

function categoryColor(cat: string): string {
  switch (cat) {
    case 'flavor_description': return 'primary'
    case 'lcp_origin': return 'warning'
    case 'npc_stats': return 'info'
    default: return 'subtle'
  }
}
</script>
