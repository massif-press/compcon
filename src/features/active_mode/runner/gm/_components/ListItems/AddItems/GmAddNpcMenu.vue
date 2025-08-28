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
        <v-divider />
        <v-tabs grow v-model="tab" bg-color="primary" height="30">
          <v-tab>Roster</v-tab>
          <v-tab>Share Code</v-tab>
          <v-tab>File Import</v-tab>
        </v-tabs>
        <v-window v-model="tab" class="pa-4">
          <v-window-item value="Roster">
            <v-row class="mb-1">
              <v-col cols="6">
                <cc-text-field
                  v-model="search"
                  color="primary"
                  icon="mdi-magnify"
                  class="mb-4"
                  clearable />
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
          </v-window-item>
          <v-window-item value="Share Code">
            <v-card flat tile class="pa-4">Share Code Coming Soon</v-card>
          </v-window-item>
          <v-window-item value="File Import">
            <v-card flat tile class="pa-4">File Import Coming Soon</v-card>
          </v-window-item>
        </v-window>
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
  }),
  props: {
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  computed: {
    npcs() {
      return NpcStore().getUnits.filter(
        (npc) => this.search === '' || npc.Name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },

  methods: {
    add(npc) {
      const number =
        this.encounterInstance.Combatants.filter((c) => c.actor.Name === npc.Name).length + 1;
      this.encounterInstance.Combatants.push({
        id: npc.ID,
        index: -1,
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
