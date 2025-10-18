<template>
  <v-dialog max-width="90vw">
    <template #activator="{ props }">
      <v-btn
        flat
        block
        variant="text"
        color="accent"
        prepend-icon="mdi-cube"
        @click="props.onClick($event)">
        Add Other
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar flat color="primary" height="40">
          <div class="heading h3 px-4">Add Other</div>
          <v-spacer />
          <v-btn flat tile icon @click="isActive.value = false">
            <v-icon icon="mdi-close" class="white--text" />
          </v-btn>
        </v-toolbar>
        <v-divider />
        <v-tabs grow v-model="tab" bg-color="primary" height="30">
          <v-tab>Doodad</v-tab>
          <v-tab>Eidolon</v-tab>
        </v-tabs>
        <v-window v-model="tab" class="pa-4">
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
                v-model="group"
                :items="groups"
                clearable
                return-object
                item-text="Name"
                chip-variant="text"
                item-title="Name" />
            </v-col>
          </v-row>
          <v-window-item value="Doodad">
            <v-card-text class="pt-0">
              <v-card
                flat
                tile
                v-for="doodad in doodads"
                class="border-sm mb-1"
                @click="add(doodad)">
                <v-row :key="doodad.ID">
                  <v-col cols="auto">
                    <cc-img :src="doodad.Portrait" width="80" />
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
              <v-card flat tile v-for="e in eidolons" class="border-sm mb-1" @click="addEidolon(e)">
                <v-row :key="e.ID">
                  <v-col cols="auto">
                    <cc-img :src="e.Portrait" width="80" />
                  </v-col>
                  <v-col>
                    <div class="heading h3">{{ e.Name }}</div>
                    <div class="text-text">
                      <cc-slashes />
                      Tier {{ e.Tier }}
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

<script>
import { Npc } from '@/classes/npc/Npc';
import { NpcStore } from '@/stores';
import _ from 'lodash';

export default {
  name: 'GmAddNpcMenu',
  data: () => ({
    tab: 'Doodad',
    search: '',
  }),
  props: {
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  computed: {
    doodads() {
      return NpcStore()
        .getDoodads.filter(
          (npc) => this.search === '' || npc.Name.toLowerCase().includes(this.search.toLowerCase())
        )
        .filter((npc) => (this.folder ? npc.FolderController.Folder === this.folder : true));
    },
    eidolons() {
      return NpcStore()
        .getEidolons.filter(
          (npc) => this.search === '' || npc.Name.toLowerCase().includes(this.search.toLowerCase())
        )
        .filter((npc) => (this.folder ? npc.FolderController.Folder === this.folder : true));
    },
  },

  methods: {
    add(doodad) {
      const number =
        this.encounterInstance.Combatants.filter((c) => c.actor.Name === doodad.Name).length + 1;

      this.encounterInstance.Combatants.push({
        id: doodad.ID,
        index: this.encounterInstance.Combatants.length,
        number: number,
        side: 'neutral',
        type: 'doodad',
        actor: doodad,
        deployables: [],
      });
      this.$notify({
        type: 'success',
        title: 'Doodad Added',
        text: `${doodad.Name} has been added to the encounter.`,
      });
    },
    addEidolon(eidolon) {
      const number =
        this.encounterInstance.Combatants.filter((c) => c.actor.Name === eidolon.Name).length + 1;

      this.encounterInstance.Combatants.push({
        id: eidolon.ID,
        index: this.encounterInstance.Combatants.length,
        number: number,
        side: 'enemy',
        type: 'eidolon',
        actor: eidolon,
        deployables: [],
      });
      this.$notify({
        type: 'success',
        title: 'Eidolon Added',
        text: `${eidolon.Name} has been added to the encounter.`,
      });
    },
  },
};
</script>
