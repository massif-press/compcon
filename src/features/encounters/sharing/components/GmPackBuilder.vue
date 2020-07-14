<template>
  <v-container style="min-height: 100%;" fluid class="mt-9">
    <h1 v-resize-text="{ maxFontSize: '36pt' }" class="heading">BUILD GM PACK</h1>
    <v-tabs
      :vertical="$vuetify.breakpoint.mdAndUp"
      background-color="primary"
      :slider-size="12"
      slider-color="active"
    >
      <v-tab ripple>MISSIONS</v-tab>
      <v-tab ripple>ENCOUNTERS</v-tab>
      <v-tab ripple>NPCS</v-tab>
      <v-tab-item>
        <v-data-table
          v-model="selectedMissions"
          disable-pagination
          overflow="auto"
          show-select
          item-key="value._id"
          hide-default-footer
          :items="missions"
          :headers="missionHeaders"
        >
        </v-data-table>
      </v-tab-item>
      <v-tab-item>
        <v-data-table
          v-model="selectedEncounters"
          disable-pagination
          overflow="auto"
          show-select
          item-key="value._id"
          hide-default-footer
          :items="encounters"
          :headers="encounterHeaders"
        >
          <template v-slot:item.data-table-select="{ item, isSelected, select }">
            <v-simple-checkbox :disabled="item.locks > 0" :value="isSelected" @input="select($event)"></v-simple-checkbox>
          </template>
          <template v-slot:item.locks="{ item }">
            <v-icon v-show="item.locks > 0">mdi-lock</v-icon>
          </template>
        </v-data-table>
      </v-tab-item>
      <v-tab-item>
        <v-data-table
          v-model="selectedNpcs"
          disable-pagination
          overflow="auto"
          show-select
          item-key="value._id"
          hide-default-footer
          :items="npcs"
          :headers="npcHeaders"
        >
          <template v-slot:item.data-table-select="{ item, isSelected, select }">
            <v-simple-checkbox :disabled="item.locks > 0" :value="isSelected" @input="select($event)"></v-simple-checkbox>
          </template>
          <template v-slot:item.locks="{ item }">
            <v-icon v-show="item.locks > 0">mdi-lock</v-icon>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs>
    <v-divider />
    <v-container fluid>
      <v-row class="my-3">
        <v-text-field
          v-model="packName"
          outlined
          label="Name"
          hide-details
        >
          <template v-slot:append-outer>
            <v-icon v-if="!packName" color="error">mdi-alert</v-icon>
            <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
          </template>
        </v-text-field>
      </v-row>
      <v-row class="my-3">
        <v-text-field
          v-model="packDescription"
          outlined
          label="Description"
          hide-details
        >
        </v-text-field>
      </v-row>
      <v-row class="my-3">
        <v-col>
          <cc-btn large color="primary" @click="exportGmPack">SAVE LOCALLY</cc-btn>
        </v-col>
        <v-col>
          <cc-btn :disabled="true" large color="primary">UPLOAD</cc-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import _ from 'lodash'
import { Npc, Mission, Encounter, GmPack } from '@/class'
import { NpcStore, EncounterStore, MissionStore } from '@/store'
import { saveFile } from '@/io/Dialog'

interface DatagridValue<T> {
  value: T
  locks: number
}

type MissionDatagridValue = DatagridValue<Mission>
type EncounterDatagridValue = DatagridValue<Encounter>
type NpcDatagridValue = DatagridValue<Npc>

export default Vue.extend({
  data: () => {
    return {
      missionHeaders: [
        { text: 'Name', align: 'left', value: 'value.Name' },
      ],
      encounterHeaders: [
        { text: 'Name', align: 'left', value: 'value.Name' },
        { text: 'Locked by Parent', align: 'left', value: 'locks' },
      ],
      npcHeaders: [
        { text: 'Name', align: 'left', value: 'value.Name'},
        { text: 'Locked by Parent', align: 'left', value: 'locks'},
      ],
      npcs: [],
      missions: [],
      encounters: [],
      selectedNpcs: [],
      selectedMissions: [],
      selectedEncounters: [],
      packName: "",
      packDescription: ""
    }
  },
  watch: {
    selectedMissions: {
      deep: true,
      handler (newVal, oldVal) {
        // if lengh of new is bigger than old, we have a new missiom, and must lock it's children
        if (newVal.length > oldVal.length) {
          const addedvalues = newVal.filter(val => !oldVal.includes(val))
          addedvalues.map(this.lockMissionChildren)
          // if lengh of new is smaller than old, we have removed missiom, and must unlock it's children
        } else if (newVal.length < oldVal.length) {
          const removedvalues = oldVal.filter(val => !newVal.includes(val));
          removedvalues.map(this.unlockMissionChildren)
        }
      }
    },
    selectedEncounters: {
      deep: true,
      handler (newVal, oldVal) {
        // if lengh of new is bigger than old, we have a new missiom, and must lock it's children
        if (newVal.length > oldVal.length) {
          const addedvalues = newVal.filter(val => !oldVal.includes(val))
          addedvalues.map(this.lockEncounterChildren)
          // if lengh of new is smaller than old, we have removed missiom, and must unlock it's children
        } else if (newVal.length < oldVal.length) {
          const removedvalues = oldVal.filter(val => !newVal.includes(val));
          removedvalues.map(this.unlockEncounterChildren)
        }
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData(): void {
      const npcStore = getModule(NpcStore, this.$store)
      const npcs: {value: Npc, locks: number}[] = npcStore.getNpcs.map(npc => {
        return { value: npc, locks: 0 }
      });

      const encounterStore = getModule(EncounterStore, this.$store)
      const encounters: EncounterDatagridValue[] = encounterStore.getEncounters.map(enc => {
        return { value: enc, locks: 0 }
      });

      const missionStore = getModule(MissionStore, this.$store)
      const missions: MissionDatagridValue[] = missionStore.getMissions.map(mission => {
        return { value: mission, locks: 0 }
      });

      this.npcs = npcs
      this.encounters = encounters
      this.missions = missions
    },
    lockMissionChildren(mission: MissionDatagridValue) {
      const encounters: EncounterDatagridValue[] = mission.value.Encounters.map(
        enc => _.find(this.encounters, (dataGridItem) => dataGridItem.value.ID === enc.ID )
      )
      encounters.map(enc => {
        this.selectedEncounters.push(enc)
        this.lockEncounterChildren(enc)
        enc.locks += 1
      })
    },
    unlockMissionChildren(mission: MissionDatagridValue) {
      const encounters: EncounterDatagridValue[] = mission.value.Encounters.map(
        enc => _.find(this.encounters, (dataGridItem) => dataGridItem.value.ID === enc.ID )
      )
      encounters.map(enc => {
        this.unlockEncounterChildren(enc)
        enc.locks -= 1
      })
    },
    lockEncounterChildren(encounter: EncounterDatagridValue) {
      const npcs: NpcDatagridValue[] = encounter.value.Npcs("all").map(
        npc => _.find(this.npcs, (dataGridItem) => dataGridItem.value.ID === npc.ID )
      )
      npcs.map(npc => {
        this.selectedNpcs.push(npc)
        npc.locks += 1
      })
    },
    unlockEncounterChildren(encounter: EncounterDatagridValue) {
      const npcs: NpcDatagridValue[] = encounter.value.Npcs("all").map(
        npc => _.find(this.npcs, (dataGridItem) => dataGridItem.value.ID === npc.ID )
      )
      npcs.map(enc => {
        enc.locks -= 1
      })
    },
    async exportGmPack() {
      const missionStore = getModule(MissionStore, this.$store)
      const encounterStore = getModule(EncounterStore, this.$store)
      const npcStore = getModule(NpcStore, this.$store)

      const missions = this.selectedMissions.map((selectedMission) => _.find(missionStore.Missions, (mission) => selectedMission.value.ID === mission.ID ))
      const encounters = this.selectedEncounters.map((selectedEncounter) => _.find(encounterStore.Encounters, (encounter) => selectedEncounter.value.ID === encounter.ID ))
      const npcs = this.selectedNpcs.map((selectedNpc) => _.find(npcStore.Npcs, (npc) => selectedNpc.value.ID === npc.ID ))

      const gmPack = new GmPack(
        this.packName,
        this.packDescription,
        missions,
        encounters,
        npcs
      )

      await saveFile(
        this.packName.toUpperCase().replace(/\W/g, '') + '.json',
        JSON.stringify(GmPack.Serialize(gmPack)),
        'Save GM Pack'
      )
    }
  }
})
</script>

<style>
</style>