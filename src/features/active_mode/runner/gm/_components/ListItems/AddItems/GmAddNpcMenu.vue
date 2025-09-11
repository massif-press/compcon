<template>
  <v-dialog max-width="90vw">
    <template #activator="{ props }">
      <v-btn
        flat
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
        <v-toolbar flat color="primary" height="40">
          <div class="heading h3 px-4">Add Non Player Character</div>
          <v-spacer />
          <v-btn flat tile icon @click="isActive.value = false">
            <v-icon icon="mdi-close" class="white--text" />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row class="mb-1">
            <v-col cols="6">
              <cc-text-field
                v-model="search"
                color="primary"
                icon="mdi-magnify"
                class="mb-4"
                clearable />
            </v-col>
            <v-col cols="auto" align-self="center">
              <v-icon icon="mdi-folder" class="ml-2 mr-n4" />
            </v-col>
            <v-col>
              <cc-select
                v-model="folder"
                :items="folders"
                clearable
                return-object
                item-text="Name"
                chip-variant="text"
                item-title="Name" />
            </v-col>
          </v-row>
          <v-card flat tile v-for="npc in npcs" class="border-sm mb-1" @click="add(npc)">
            <v-row :key="npc.ID">
              <v-col cols="auto">
                <cc-img :src="npc.Portrait" width="80" />
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

<script>
import { NpcStore } from '@/stores';
import _ from 'lodash';

export default {
  name: 'GmAddNpcMenu',
  data: () => ({
    tab: 'Roster',
    search: '',
    folder: null,
  }),
  props: {
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  computed: {
    npcs() {
      return NpcStore()
        .getUnits.filter(
          (npc) => this.search === '' || npc.Name.toLowerCase().includes(this.search.toLowerCase())
        )
        .filter((npc) => (this.folder ? npc.FolderController.Folder === this.folder : true));
    },
    folders() {
      const folders = _.uniq(this.npcs.map((npc) => npc.FolderController.Folder)).filter(
        (f) => !!f
      );
      return folders;
    },
  },

  methods: {
    add(npc) {
      const number =
        this.encounterInstance.Combatants.filter((c) => c.actor.Name === npc.Name).length + 1;
      this.encounterInstance.Combatants.push({
        id: npc.ID,
        index: this.encounterInstance.Combatants.length,
        number: number,
        side: 'enemy',
        type: 'unit',
        actor: npc,
        deployables: [],
      });
      this.$notify({
        type: 'success',
        title: 'NPC Added',
        text: `${npc.Name} has been added to the encounter.`,
      });
    },
  },
};
</script>
