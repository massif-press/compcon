<template>
  <v-dialog max-width="90vw">
    <template #activator="{ props }">
      <v-btn flat
        block
        variant="text"
        color="accent"
        prepend-icon="cc:frame"
        @click="props.onClick($event)">
        Add NPC
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar flat
          color="primary"
          height="40">
          <div class="heading h3 px-4">Add Non Player Character</div>
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
              <cc-select v-model="folder"
                :items="folders"
                clearable
                return-object
                item-text="Name"
                chip-variant="text"
                item-title="Name" />
            </v-col>
          </v-row>
          <v-card v-for="npc in npcs"
            :key="npc.ID"
            flat
            tile
            class="border-sm mb-1"
            @click="add(npc)">
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
                  Tier {{ npc.NpcClassController?.Tier || 1 }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { notify } from '@/util/notify'
import { NpcStore } from '@/stores';
import * as _ from 'lodash-es';
import { v4 as uuid } from 'uuid';

const props = defineProps<{
  encounterInstance: object
}>()

const tab = ref('Roster')
const search = ref('')
const folder = ref(null)

const npcs = computed(() => {
      return NpcStore()
        .getUnits.filter(
          (npc) => search.value === '' || npc.Name.toLowerCase().includes(search.value.toLowerCase())
        )
        .filter((npc) => (folder.value ? npc.FolderController.Folder === folder.value : true));
    })
const folders = computed(() => {
      const folders = _.uniq(npcs.value.map((npc) => npc.FolderController.Folder)).filter(
        (f) => !!f
      );
      return folders;
    })

function add(rosterItem) {
      const npc = rosterItem.Clone(false);

      const number =
        props.encounterInstance.Combatants.filter((c) => c.actor.Name === npc.Name).length + 1;

      npc.CombatController.StatController.applyRegisteredCustomStats()
      npc.FeatureController.BonusController.applyToStats(npc.CombatController.StatController, props.encounterInstance)
      npc.CombatController.StatController.resetCurrentStats()
      npc.CombatController.Reset();

      props.encounterInstance.Combatants.push({
        id: uuid(),
        index: props.encounterInstance.Combatants.length,
        number: number,
        side: 'enemy',
        type: 'unit',
        actor: npc,
        deployables: [],
      });
      notify({
        type: 'success',
        title: 'NPC Added',
        text: `${npc.Name} has been added to the encounter.`,
      });
    }
</script>
