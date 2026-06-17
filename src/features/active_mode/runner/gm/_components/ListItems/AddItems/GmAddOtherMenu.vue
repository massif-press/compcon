<template>
  <v-dialog max-width="90vw">
    <template #activator="{ props }">
      <v-btn flat
        block
        variant="text"
        color="accent"
        prepend-icon="mdi-cube"
        @click="props.onClick($event)">
        {{ $t('active.addOther.addOther') }}
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar flat
          color="primary"
          height="40">
          <div class="heading h3 px-4">{{ $t('active.addOther.addOther') }}</div>
          <v-spacer />
          <v-btn flat
            tile
            icon
            @click="isActive.value = false">
            <v-icon icon="mdi-close"
              class="white--text" />
          </v-btn>
        </v-toolbar>
        <v-divider />
        <v-tabs v-model="tab"
          grow
          bg-color="primary"
          height="30">
          <v-tab value="Doodad">{{ $t('active.addOther.doodad') }}</v-tab>
          <v-tab value="Eidolon">{{ $t('common.eidolon') }}</v-tab>
        </v-tabs>
        <v-window v-model="tab"
          class="pa-4">
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
              <cc-select v-model="folder"
                :items="folders"
                clearable
                return-object
                item-text="Name"
                chip-variant="text"
                item-title="Name" />
            </v-col>
          </v-row>
          <v-window-item value="Doodad">
            <v-card-text class="pt-0">
              <v-card v-for="doodad in doodads"
                :key="doodad.ID"
                flat
                tile
                class="border-sm mb-1"
                @click="add(doodad)">
                <v-row>
                  <v-col cols="auto">
                    <cc-img :src="doodad.Portrait"
                      width="80" />
                  </v-col>
                  <v-col>
                    <div class="heading h3">{{ doodad.Name }}</div>
                  </v-col>
                </v-row>
              </v-card>
            </v-card-text>
          </v-window-item>
          <v-window-item value="Eidolon">
            <v-card-text class="pt-0">
              <v-card v-for="e in eidolons"
                :key="e.ID"
                flat
                tile
                class="border-sm mb-1"
                @click="addEidolon(e)">
                <v-row>
                  <v-col cols="auto">
                    <cc-img :src="e.Portrait"
                      width="80" />
                  </v-col>
                  <v-col>
                    <div class="heading h3">{{ e.Name }}</div>
                    <div class="text-text">
                      <cc-slashes />
                      {{ $t('common.tierN', { n: e.Tier }) }}
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-card-text>
          </v-window-item>
        </v-window>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { computed, ref } from 'vue'
import { notify } from '@/util/notify'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { NpcStore } from '@/stores';
import * as _ from 'lodash-es';
import { v4 as uuid } from 'uuid';

defineOptions({ name: 'GmAddNpcMenu' })

const props = defineProps<{
  encounterInstance: EncounterInstance
}>()

const tab = ref('Doodad')
const search = ref('')
const folder = ref(null)

const folders = computed(() => {
  return NpcStore().getFolders;
})
const doodads = computed(() => {
  return NpcStore()
    .getDoodads.filter(
      (npc) => !search.value || npc.Name.toLowerCase().includes(search.value.toLowerCase())
    )
    .filter((npc) => (folder.value ? npc.FolderController.Folder === folder.value : true));
})
const eidolons = computed(() => {
  return NpcStore()
    .getEidolons.filter(
      (npc) => !search.value || npc.Name.toLowerCase().includes(search.value.toLowerCase())
    )
    .filter((npc) => (folder.value ? npc.FolderController.Folder === folder.value : true));
})

function add(rosterItem) {
  const doodad = rosterItem.Clone(false);

  const number =
    props.encounterInstance.Combatants.filter((c) => c.actor.Name === doodad.Name).length + 1;

  props.encounterInstance.Combatants.push({
    id: uuid(),
    index: props.encounterInstance.Combatants.length,
    number: number,
    side: 'neutral',
    type: 'doodad',
    actor: doodad,
    deployables: [],
  });
  notify({
    type: 'success',
    title: t('active.addCombatant.doodadAddedTitle'),
    text: t('active.addCombatant.addedText', { name: doodad.Name }),
  });
}
function addEidolon(rosterItem) {
  const eidolon = rosterItem.Clone(false);

  const number =
    props.encounterInstance.Combatants.filter((c) => c.actor.Name === eidolon.Name).length + 1;

  const playerCount = props.encounterInstance.Combatants.filter(c => c.side === 'ally').length

  eidolon.CombatController.StatController.applyRegisteredCustomStats()
  eidolon.FeatureController.BonusController.applyToStats(eidolon.CombatController.StatController, props.encounterInstance)
  eidolon.CombatController.StatController.resetCurrentStats()
  eidolon.CombatController.Reset();

  eidolon.Layers.forEach((l) => {
    l.CombatController.StatController.applyRegisteredCustomStats()
    l.FeatureController.BonusController.applyToStats(l.CombatController.StatController, props.encounterInstance)
    l.ResetHp(playerCount, true)
    l.SetActivations(playerCount)
    l.CombatController.StatController.resetCurrentStats()
    l.CombatController.Reset()
  });

  props.encounterInstance.Combatants.push({
    id: uuid(),
    index: props.encounterInstance.Combatants.length,
    number: number,
    side: 'enemy',
    type: 'eidolon',
    actor: eidolon,
    deployables: [],
  });
  notify({
    type: 'success',
    title: t('active.addCombatant.eidolonAddedTitle'),
    text: t('active.addCombatant.addedText', { name: eidolon.Name }),
  });
}
</script>
