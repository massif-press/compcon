<template>
  <v-dialog max-width="90vw">
    <template #activator="{ props }">
      <v-btn flat
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
        <v-toolbar flat
          color="primary"
          height="40">
          <div class="heading h3 px-4">Add Player Character</div>
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
              <cc-select v-model="group"
                :items="groups"
                clearable
                return-object
                item-text="Name"
                chip-variant="text"
                item-title="Name" />
            </v-col>
          </v-row>
          <v-card flat
            tile
            v-for="pc in pilots"
            class="border-sm mb-1">
            <v-row :key="pc.ID">
              <v-col cols="auto">
                <cc-img :src="pc.Portrait"
                  width="80" />
              </v-col>
              <v-col>
                <div class="heading h3">{{ pc.Callsign }}</div>
                <div class="text-text">
                  {{ pc.Name }}
                  <cc-slashes />
                  License Level {{ pc.Level }}
                  <v-row dense
                    align="center">
                    <v-col>
                      <cc-select v-model="pc.ActiveMech"
                        :items="pc.Mechs"
                        :item-title="(x) => `${x.Name} (${x.Frame.Source} ${x.Frame.Name})`"
                        return-object
                        icon="cc:frame" />
                    </v-col>
                    <cc-button color="primary"
                      :disabled="!pc.ActiveMech"
                      @click="addPc(pc)">
                      Add
                    </cc-button>
                  </v-row>
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
import { PilotStore } from '@/stores';
import _ from 'lodash';

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
  data: () => ({
    tab: 'Roster',
    search: '',
    group: null,
    groups: [],
  }),
  computed: {
    pilots() {
      return PilotStore()
        .Pilots.filter(
          (p) =>
            !this.encounterInstance.Combatants.filter((x) => x.type === 'pilot').some(
              (c) => c.actor.Name === p.Name
            ) &&
            (!this.search ||
              p.Callsign.toLowerCase().includes(this.search.toLowerCase()) ||
              p.Name.toLowerCase().includes(this.search.toLowerCase()))
        )
        .filter((p) =>
          this.group && this.group.ID !== 'no_group'
            ? this.group.Pilots.some((x) => x.id === p.ID)
            : true
        )
        .sort((a, b) => a.Callsign.localeCompare(b.Callsign));
    },
    groups() {
      return PilotStore().getPilotGroups();
    },
  },

  methods: {
    addPc(pc) {
      if (this.encounterInstance.Combatants.some((p) => p.ID === pc.ID)) return;

      pc.SetStats();
      pc.CombatController.SetBonusStats(this.encounterInstance)
      pc.CombatController.Reset();

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
