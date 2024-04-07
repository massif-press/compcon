<template>
  <v-row no-gutters>
    <v-col cols="auto">
      <v-text-field
        density="compact"
        hide-details
        clearable
        placeholder="Search"
        class="my-1"
        prepend-inner-icon="mdi-magnify" />

      <v-btn-toggle
        v-model="itemTypes"
        multiple
        mandatory
        density="compact"
        size="small"
        class="rounded-0">
        <v-btn value="unit" color="primary">NPCs</v-btn>
        <v-btn value="doodad" color="primary" class="">Doodads</v-btn>
        <v-btn value="eidolon" color="primary" class="">Eidolons</v-btn>
      </v-btn-toggle>
      <v-list
        class="mb-n3"
        style="height: 100%; min-height: calc(100vh - 86px); overflow-y: scroll">
        <v-list-item v-for="folder in Object.keys(npcsByFolder)" :key="folder">
          <v-list-item-subtitle
            ><v-icon icon="mdi-folder" start size="small" class="mt-n1" />
            {{ folder || 'No Folder' }}</v-list-item-subtitle
          >
          <v-divider />
          <v-list-item v-for="n in npcsByFolder[folder]" :key="n.ID" @click="selected = n">
            <v-icon :icon="n.Icon" start /> {{ n.Name }}
            <template #append>
              <v-tooltip>
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="tonal"
                    color="secondary"
                    @click.stop="$emit('select', n)">
                    <v-icon icon="mdi-plus" size="x-large" />
                  </v-btn>
                </template>
                <span>Add to Encounter</span>
              </v-tooltip>
            </template>
          </v-list-item>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col>
      <div v-if="selected">
        <unit-editor
          v-if="(selected as any).ItemType.toLowerCase() === 'unit'"
          :item="selected"
          readonly />
        <doodad-editor
          v-if="(selected as any).ItemType.toLowerCase() === 'doodad'"
          :item="selected"
          readonly />
        <eidolon-editor
          v-if="(selected as any).ItemType.toLowerCase() === 'eidolon'"
          :item="selected"
          readonly />
      </div>
      <div v-else>
        <v-row justify="center" align="center" style="height: calc(100vh - 60px)">
          <v-col cols="auto"> <i class="text-disabled">Select an NPC</i> </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { NpcStore } from '@/stores';
import UnitEditor from '@/features/gm/npc_roster/npcs/editor.vue';
import DoodadEditor from '@/features/gm/npc_roster/doodads/editor.vue';
import EidolonEditor from '@/features/gm/npc_roster/eidolons/editor.vue';
import _ from 'lodash';

export default {
  name: 'combatant-selector-list-view',
  components: { UnitEditor, DoodadEditor, EidolonEditor },
  emits: ['select'],
  props: {
    mode: { type: String, default: 'list' },
  },
  data: () => ({
    selected: null,
    itemTypes: ['unit', 'doodad', 'eidolon'],
  }),
  computed: {
    npcs() {
      return NpcStore().Npcs;
    },
    filteredNpcs() {
      return this.npcs.filter((n) => this.itemTypes.includes(n.ItemType.toLowerCase()));
    },
    npcsByFolder() {
      return _.groupBy(this.filteredNpcs, 'FolderController.Folder');
    },
  },
  methods: {
    addUnit() {
      throw new Error('Method not implemented.');
    },
  },
};
</script>
