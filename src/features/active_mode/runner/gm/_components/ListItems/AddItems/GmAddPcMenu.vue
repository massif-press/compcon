<template>
  <v-dialog max-width="90vw">
    <template #activator="{ props }">
      <v-btn
        flat
        block
        variant="text"
        color="accent"
        prepend-icon="cc:pilot"
        @click="props.onClick($event)">
        Add PC
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar flat color="primary" height="40">
          <div class="heading h3 px-4">Add Player Character</div>
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
            <v-card flat tile v-for="pc in pilots" class="border-sm mb-1" @click="addPc(pc)">
              <v-row :key="pc.ID">
                <v-col cols="auto">
                  <cc-img :src="pc.Portrait" width="80" />
                </v-col>
                <v-col>
                  <div class="heading h3">{{ pc.Callsign }}</div>
                  <div class="text-text">
                    {{ pc.Name }}
                    <cc-slashes />
                    License Level {{ pc.Level }}
                    <div v-if="pc.ActiveMech">
                      <v-icon icon="cc:frame" class="mt-n1 mr-1" />
                      <strong>
                        {{ pc.ActiveMech.Frame.Source }} {{ pc.ActiveMech.Frame.Name }}
                      </strong>
                      <cc-slashes class="mx-1" />

                      <i>{{ pc.ActiveMech.Name }}</i>
                    </div>
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
import { PilotStore } from '@/stores';
import _, { add } from 'lodash';

export default {
  name: 'GmAddPcMenu',
  data: () => ({
    tab: 'Roster',
  }),
  props: {
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  computed: {
    pilots() {
      return PilotStore().Pilots.filter(
        (p) => !this.encounterInstance.Pilots.some((ep) => ep.ID === p.ID)
      );
    },
  },

  methods: {
    addPc(pc) {
      if (this.encounterInstance.Pilots.some((p) => p.ID === pc.ID)) return;

      this.encounterInstance.Pilots.push(pc);
      this.encounterInstance.Combatants.push({
        id: pc.ID,
        index: -1,
        number: -1,
        side: 'ally',
        type: 'pilot',
        actor: pc,
        deployables: [],
      });
    },
  },
};
</script>
