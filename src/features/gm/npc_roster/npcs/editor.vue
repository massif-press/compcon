<template>
  <editor-base
    :item="item"
    :readonly="readonly"
    :hide-toolbar="hideToolbar"
    :hide-footer="hideFooter"
    @exit="exit()"
    @save="save()"
    @delete="deleteItem()"
    @export="exportItem($event)"
    @copy="dupe()"
  >
    <template #builder>
      <builder
        :item="item"
        :readonly="readonly"
      />
    </template>
    <template #stats>
      <npc-tier-selector
        :item="item"
        :readonly="readonly"
        class="mt-4"
      />
      <stat-editor
        :item="item"
        :controller="item.NpcClassController"
        :bonuses="item.FeatureController.Bonuses"
        :readonly="readonly"
      />
    </template>
    <template #footer>
      <cc-button
        prepend-icon="mdi-upload"
        size="small"
        class="ml-2"
        @click="exportV2Item(item)"
      >
        {{ $t('gm.npcEditor.v2Export') }}
      </cc-button>
      <cc-dialog
        :title="$t('gm.titles.npcStatblock')"
        icon="mdi-text-account"
        max-width="1200px"
        :close-on-click="false"
        major
      >
        <template #activator="{ open }">
          <cc-button
            prepend-icon="mdi-text-account"
            size="small"
            class="ml-2"
            @click="open"
          >
            {{ $t('gm.npcEditor.statblock') }}
          </cc-button>
        </template>
        <template #default="{ close }">
          <npc-statblock
            :item="<Unit>item"
            @close="close"
          />
        </template>
      </cc-dialog>
      <cc-dialog
        :title="`${item.Name} ${$t('active.telemetry.telemetry')}`"
        icon="mdi-chart-donut-variant"
        :close-on-click="false"
      >
        <template #activator="{ open }">
          <cc-button
            prepend-icon="mdi-chart-donut-variant"
            size="small"
            class="ml-2"
            @click="open"
          >
            {{ $t('active.telemetry.telemetry') }}
          </cc-button>
        </template>
        <template #default>
          <div
            v-if="!telemetry.encounters"
            class="text-center text-disabled text-cc-overline pa-4"
          >
            {{ $t('gm.npcEditor.noTelemetry') }}
          </div>
          <div v-else>
            <div class="text-caption text-disabled mb-1">
              {{ $t('active.telemetry.encountersLogged') }}
              <b class="text-accent">{{ telemetry.encounters }}</b>
            </div>
            <rollup-display :rollup="telemetry.rollup" />
          </div>
        </template>
      </cc-dialog>
    </template>
    <div v-if="item.NpcClassController?.HasClass">
      <features
        :npc="item"
        :readonly="readonly"
      />
    </div>
  </editor-base>
</template>

<script setup lang="ts">
  import EditorBase from '../../../gm/_components/EditorBase.vue'
  import StatEditor from '../../_components/StatEditor.vue'
  import NpcTierSelector from './_components/NpcTierSelector.vue'
  import NpcStatblock from './_components/NpcStatblock.vue'
  import { computed } from 'vue'
  import { NpcStore } from '@/stores'
  import { EncounterStore } from '@/features/gm/store/encounter_store'
  import { reduceEvents, mergeRollups } from '@/classes/components/combat/log/telemetry'
  import RollupDisplay from '@/features/active_mode/runner/gm/EncounterPanels/_components/_RollupDisplay.vue'
  import Features from './features.vue'
  import Builder from './builder.vue'
  import { Unit } from '@/classes/npc/unit/Unit'
  import exportAsJson from '@/util/jsonExport'
  import { convertTov2Npc } from '@/io/V2Exporter'

  defineOptions({ name: 'GmEditorNpc' })

  const props = withDefaults(
    defineProps<{
      item: Unit
      readonly?: boolean
      hideToolbar?: boolean
      hideFooter?: boolean
    }>(),
    {
      readonly: false,
      hideToolbar: false,
      hideFooter: false,
    }
  )

  const emit = defineEmits<{
    exit: []
  }>()

  const telemetry = computed(() => {
    let encounters = 0
    const rollups = EncounterStore()
      .ArchivedEncounters.filter(a => !a.SaveController.IsDeleted && a.History.events.length)
      .flatMap(a => {
        const stream = a.Stream
        const hits = stream.participants.filter(p => p.originId === props.item.ID)
        if (hits.length) encounters++
        return hits.map(p => reduceEvents(stream.events, p.id))
      })
    return { encounters, rollup: mergeRollups(rollups) }
  })

  function exit() {
    emit('exit')
  }
  async function save() {
    await NpcStore().SaveNpcData()
  }
  function deleteItem() {
    ;(props.item as Unit).SaveController.Delete()
    exit()
  }
  function dupe() {
    NpcStore().CloneNpc(props.item as Unit)
  }
  function exportItem(item) {
    exportAsJson(Unit.Serialize(item, false), `${item.Name}.json`)
  }
  function exportV2Item(item) {
    const data = convertTov2Npc(Unit.Serialize(item, true))
    exportAsJson(data, `${item.Name}-v2.json`)
  }
</script>
