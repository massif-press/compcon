<template>
  <div v-if="!incoming">
    <p class="text-caption text-disabled mb-3">{{ $t('pm.logbook.importIntro') }}</p>
    <cc-button
      block
      color="primary"
      prepend-icon="mdi-file-upload"
      @click="pickFile"
    >
      {{ $t('pm.logbook.chooseFile') }}
    </cc-button>
    <div
      v-if="error"
      class="text-caption text-error mt-2"
    >
      {{ error }}
    </div>
  </div>

  <div v-else>
    <cc-panel
      color="background"
      class="mb-3"
      :title="$t('pm.logbook.incoming')"
    >
      <div class="heading h3">{{ candidate.encounterName || $t('pm.logbook.unnamed') }}</div>
      <div class="text-caption text-disabled">
        {{
          $t('pm.logbook.candidateSummary', {
            rounds: candidate.rounds,
            date: new Date(candidate.start).toLocaleDateString(),
            participants: incoming.participants.length,
            events: incoming.events.length,
          })
        }}
      </div>
      <div class="text-caption text-disabled">
        {{ candidate.source === 'gm' ? $t('pm.logbook.sourceGm') : $t('pm.logbook.sourceSelf') }}
      </div>
    </cc-panel>

    <div
      v-if="plan!.action === 'replace'"
      class="mb-3"
    >
      <cc-alert color="warning">
        {{ $t('pm.logbook.autoReplace', { name: heldName(plan!.targetIndex) }) }}
      </cc-alert>
    </div>

    <div v-else>
      <v-btn-toggle
        v-model="mode"
        mandatory
        divided
        density="compact"
        variant="outlined"
        color="primary"
        class="mb-2 w-100"
      >
        <v-btn
          value="add"
          size="small"
          class="flex-grow-1"
        >
          {{ $t('pm.logbook.addNew') }}
        </v-btn>
        <v-btn
          value="replace"
          size="small"
          class="flex-grow-1"
          :disabled="!logbook.Records.length"
        >
          {{ $t('pm.logbook.replaceExisting') }}
        </v-btn>
      </v-btn-toggle>

      <div v-if="mode === 'replace'">
        <cc-alert
          color="error"
          class="mb-2"
        >
          {{ $t('pm.logbook.replaceWarning') }}
        </cc-alert>
        <v-list
          density="compact"
          bg-color="background"
        >
          <v-list-item
            v-for="(r, i) in logbook.Records"
            :key="r.encounterId"
            :active="replaceIndex === i"
            :title="r.encounterName || $t('pm.logbook.unnamed')"
            :subtitle="
              $t('pm.logbook.heldSummary', {
                rounds: r.rounds,
                date: new Date(r.start).toLocaleDateString(),
              })
            "
            @click="replaceIndex = i"
          >
            <template
              v-if="plan!.suggestions.includes(i)"
              #append
            >
              <v-chip
                size="x-small"
                color="primary"
                label
              >
                {{ $t('pm.logbook.suggested') }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </div>

    <v-divider class="my-2" />
    <v-row dense>
      <v-col>
        <cc-button
          block
          size="small"
          @click="reset"
        >
          {{ $t('common.cancel') }}
        </cc-button>
      </v-col>
      <v-col>
        <cc-button
          block
          size="small"
          color="primary"
          :disabled="mode === 'replace' && replaceIndex < 0"
          @click="apply()"
        >
          {{ $t('common.import') }}
        </cc-button>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { readStream } from '@/classes/components/combat/log/events'
  import type { ILogStream } from '@/classes/components/combat/log/events'
  import type { PilotLogbook } from '@/classes/pilot/PilotLogbook'
  import { PilotStore } from '@/features/pilot_management/store'
  import { notify } from '@/util/notify'

  const props = defineProps<{
    logbook: PilotLogbook
    pilotId: string
  }>()

  const emit = defineEmits<{ imported: [] }>()

  const { t } = useI18n()

  const incoming = ref<ILogStream | null>(null)
  const error = ref('')
  const mode = ref<'add' | 'replace'>('add')
  const replaceIndex = ref(-1)

  const plan = computed(() => (incoming.value ? props.logbook.PlanImport(incoming.value) : null))
  const candidate = computed(() => plan.value!.candidate)

  function heldName(index: number): string {
    return props.logbook.Records[index]?.encounterName || t('pm.logbook.unnamed')
  }

  function reset() {
    incoming.value = null
    error.value = ''
    mode.value = 'add'
    replaceIndex.value = -1
  }

  function pickFile() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = event => {
        error.value = ''
        try {
          const stream = readStream(JSON.parse(event.target?.result as string))
          if (!stream) {
            error.value = t('pm.logbook.notALog')
            return
          }
          incoming.value = stream
          mode.value = 'add'
          replaceIndex.value = plan.value?.suggestions[0] ?? -1
        } catch {
          error.value = t('pm.logbook.notALog')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  async function apply() {
    if (!incoming.value || !plan.value) return
    const target =
      plan.value.action === 'replace'
        ? plan.value.targetIndex
        : mode.value === 'replace'
          ? replaceIndex.value
          : -1

    props.logbook.Import(incoming.value, props.pilotId, target)
    await PilotStore().SaveLogbook(props.logbook)
    notify({ type: 'success', text: t('pm.logbook.imported') })
    emit('imported')
    reset()
  }
</script>
