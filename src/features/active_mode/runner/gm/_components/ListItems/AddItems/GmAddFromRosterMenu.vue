<template>
  <v-dialog max-width="90vw">
    <template #activator="{ props }">
      <v-btn flat
        block
        variant="text"
        color="accent"
        :prepend-icon="itemType === 'npc' ? 'cc:frame' : 'cc:pilot'"
        @click="props.onClick($event)">
        {{ itemType === 'npc' ? $t('active.addRoster.addNpc') : $t('active.addRoster.addPc') }}
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar flat
          color="primary"
          height="40">
          <div class="heading h3 px-4">
            {{ itemType === 'npc' ? $t('active.addRoster.addNpcFull') : $t('active.addRoster.addPcFull') }}
          </div>
          <v-spacer />
          <v-btn flat
            tile
            icon
            @click="isActive.value = false">
            <v-icon icon="mdi-close"
              class="white--text" />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row class="mb-1">
            <v-col cols="6">
              <cc-text-field v-model="search"
                color="primary"
                icon="mdi-magnify"
                class="mb-4"
                clearable />
            </v-col>
            <v-col cols="auto"
              align-self="center">
              <v-icon icon="mdi-folder"
                class="ml-2 mr-n4" />
            </v-col>
            <v-col>
              <cc-select v-if="itemType === 'npc'"
                v-model="folder"
                :items="folders"
                clearable
                return-object
                item-text="Name"
                chip-variant="text"
                item-title="Name" />
              <cc-select v-else
                v-model="group"
                :items="groups"
                clearable
                return-object
                item-text="Name"
                chip-variant="text"
                item-title="Name" />
            </v-col>
          </v-row>

          <template v-if="itemType === 'npc'">
            <v-card v-for="npc in npcs"
              :key="npc.ID"
              flat
              tile
              class="border-sm mb-1"
              @click="addNpc(npc)">
              <v-row>
                <v-col cols="auto">
                  <cc-img :src="npc.Portrait"
                    width="80" />
                </v-col>
                <v-col>
                  <div class="heading h3">{{ npc.Name }}</div>
                  <div class="text-text">
                    {{ npc.Name }}
                    <cc-slashes />
                    {{ $t('gm.npcStats.tier', { n: npc.NpcClassController?.Tier || 1 }) }}
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </template>

          <template v-else>
            <v-card v-for="pc in pilots"
              :key="pc.ID"
              flat
              tile
              class="border-sm mb-1">
              <v-row>
                <v-col cols="auto">
                  <cc-img :src="pc.Portrait"
                    width="80" />
                </v-col>
                <v-col>
                  <div class="heading h3">{{ pc.Callsign }}</div>
                  <div class="text-text">
                    {{ pc.Name }}
                    <cc-slashes />
                    {{ $t('active.addRoster.licenseLevelN', { n: pc.Level }) }}
                    <v-row dense
                      align="center">
                      <v-col>
                        <cc-select v-model="pc.ActiveMech"
                          :items="sortedMechs(pc)"
                          :item-title="(x) => `${x.Name} (${x.Frame.Source} ${x.Frame.Name})`"
                          return-object
                          icon="cc:frame" />
                      </v-col>
                      <cc-button color="primary"
                        :disabled="!pc.ActiveMech"
                        @click="addPc(pc)">
                        {{ $t('common.add') }}
                      </cc-button>
                    </v-row>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </template>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { notify } from '@/util/notify'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { NpcStore, PilotStore, PilotGroupStore } from '@/stores'
import { Pilot } from '@/classes/pilot/Pilot'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import * as _ from 'lodash-es'
import { v4 as uuid } from 'uuid'

defineOptions({ name: 'GmAddFromRosterMenu' })

const props = defineProps<{
  encounterInstance: EncounterInstance
  itemType: 'npc' | 'pc'
}>()

const search = ref('')
const folder = ref(null as any)
const group = ref(null as any)

const npcs = computed(() =>
  NpcStore()
    .getUnits.filter(
      (npc) => search.value === '' || npc.Name.toLowerCase().includes(search.value.toLowerCase())
    )
    .filter((npc) => (folder.value ? npc.FolderController.Folder === folder.value : true))
)

const folders = computed(() =>
  _.uniq(npcs.value.map((npc) => npc.FolderController.Folder)).filter((f) => !!f)
)

const pilots = computed(() =>
  PilotStore()
    .Pilots.filter(
      (p) =>
        !p.SaveController.IsDeleted &&
        p.Mechs.length > 0 &&
        !props.encounterInstance.Combatants.filter((x) => x.type === 'pilot').some(
          (c) => c.actor.Name === p.Name
        ) &&
        (!search.value ||
          p.Callsign.toLowerCase().includes(search.value.toLowerCase()) ||
          p.Name.toLowerCase().includes(search.value.toLowerCase()))
    )
    .filter((p) =>
      group.value && group.value.ID !== 'no_group'
        ? group.value.Pilots.some((x) => x.id === p.ID)
        : true
    )
    .sort((a, b) => a.Callsign.localeCompare(b.Callsign))
)

const groups = computed(() => PilotGroupStore().getPilotGroups())

function sortedMechs(pc: any) {
  return _.orderBy(pc.Mechs, (m) => (m.ID === pc.FavoriteMech?.ID ? 0 : 1))
}

function addNpc(rosterItem: any) {
  const npc = rosterItem.Clone(false)
  const number =
    props.encounterInstance.Combatants.filter((c) => c.actor.Name === npc.Name).length + 1
  npc.CombatController.StatController.applyRegisteredCustomStats()
  npc.FeatureController.BonusController.applyToStats(
    npc.CombatController.StatController,
    props.encounterInstance
  )
  npc.CombatController.StatController.resetCurrentStats()
  npc.CombatController.Reset()
  props.encounterInstance.Combatants.push({
    id: uuid(),
    index: props.encounterInstance.Combatants.length,
    number,
    side: 'enemy',
    type: 'unit',
    actor: npc,
    deployables: [],
  })
  notify({ type: 'success', title: t('active.addCombatant.npcAddedTitle'), text: t('active.addCombatant.addedText', { name: npc.Name }) })
}

function addPc(rosterItem: any) {
  if (props.encounterInstance.Combatants.some((p) => p.actor.ID === rosterItem.ID)) return
  const pc = Pilot.Deserialize(JSON.parse(JSON.stringify(Pilot.Serialize(rosterItem))))
  pc.SetStats()
  pc.FeatureController.BonusController.applyToStats(
    pc.CombatController.StatController,
    props.encounterInstance
  )
  pc.CombatController.StatController.resetCurrentStats()
  pc.CombatController.Reset()
  props.encounterInstance.Combatants.push({
    id: pc.ID,
    index: -1,
    number: -1,
    side: 'ally',
    type: 'pilot',
    actor: pc,
    deployables: [],
  })
}
</script>
