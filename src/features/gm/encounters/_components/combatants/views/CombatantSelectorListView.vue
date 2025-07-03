<template>
  <v-layout>
    <div
      style="position: absolute; z-index: 999"
      :style="`left: ${showNav ? (mobile ? '322' : '352') : '3'}px; top: 6px`">
      <cc-button
        :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
        size="small"
        color="primary"
        @click="(showNav as any) = !showNav" />
    </div>
    <v-navigation-drawer v-model="showNav" :width="mobile ? 320 : 350">
      <v-text-field
        density="compact"
        hide-details
        clearable
        flat
        tile
        placeholder="Search"
        class="my-1"
        prepend-inner-icon="mdi-magnify" />

      <v-btn-toggle
        v-model="itemTypes"
        multiple
        mandatory
        density="compact"
        size="small"
        class="rounded-0"
        style="width: 100%; height: 26px">
        <v-btn flat tile style="width: 33%" value="unit" color="primary">NPCs</v-btn>
        <v-btn flat tile style="width: 33%" value="doodad" color="primary">Doodads</v-btn>
        <v-btn flat tile style="width: 33%" value="eidolon" color="primary">Eidolons</v-btn>
      </v-btn-toggle>
      <v-list
        class="mb-n3"
        style="height: 100%; min-height: calc(100vh - 86px); overflow-y: scroll">
        <v-list-item v-for="folder in Object.keys(npcsByFolder)" :key="folder">
          <v-list-item-subtitle>
            <v-icon icon="mdi-folder" start size="small" class="mt-n1" />
            {{ folder || 'No Folder' }}
          </v-list-item-subtitle>
          <v-divider />
          <v-list-item
            v-for="n in npcsByFolder[folder]"
            :key="n.ID"
            :prepend-icon="(n as Npc).Icon"
            @click="(selected as any) = n">
            {{ n.Name }}
            <template #append>
              <v-tooltip>
                <template #activator="{ props }">
                  <v-badge
                    :color="itemCount(n) ? 'primary' : 'transparent'"
                    floating
                    :content="itemCount(n) || ''">
                    <cc-button
                      v-bind="props"
                      variant="outlined"
                      icon="mdi-plus"
                      color="secondary"
                      @click.stop="$emit('select', n)"></cc-button>
                  </v-badge>
                </template>
                <span>Add to Encounter</span>
              </v-tooltip>
            </template>
          </v-list-item>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="mt-2" style="overflow-y: scroll">
      <div v-if="selected" class="px-3">
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
          <v-col cols="auto"><i class="text-disabled">Select an NPC</i></v-col>
        </v-row>
      </div>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import { NpcStore } from '@/stores';
import UnitEditor from '@/features/gm/npc_roster/npcs/editor.vue';
import DoodadEditor from '@/features/gm/npc_roster/doodads/editor.vue';
import EidolonEditor from '@/features/gm/npc_roster/eidolons/editor.vue';
import _ from 'lodash';
import { Npc } from '@/classes/npc/Npc';

export default {
  name: 'combatant-selector-list-view',
  components: { UnitEditor, DoodadEditor, EidolonEditor },
  emits: ['select'],
  props: {
    encounter: { type: Object, required: true },
  },
  data: () => ({
    selected: null,
    itemTypes: ['unit', 'doodad', 'eidolon'],
    showNav: true,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
    npcs() {
      return NpcStore().Npcs.filter((x) => !x.SaveController.IsDeleted);
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
    itemCount(item) {
      return this.encounter.Combatants.filter((x) => x.actor.ID === item.ID).length;
    },
  },
};
</script>
