<template>
  <panel-view ref="view">
    <cc-gm-header slot="title" title="NPC ROSTER" />
    <template slot="left">
      <v-row dense>
        <v-col>
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            dense
            hide-details
            outlined
            clearable
          />
        </v-col>
        <v-col cols="auto">
          <roster-group @set="grouping = $event" />
        </v-col>
      </v-row>
      <v-divider class="my-2 " />
      <v-row dense>
        <v-data-table
          dense
          :items="npcs"
          :headers="headers"
          :group-by="grouping"
          :search="search"
          no-results-text="No NPCs Found"
          no-data-text="No Saved NPCs"
          hide-default-footer
          calculate-widths
          class="transparent"
          style="min-width: 100%"
          disable-pagination
        >
          <template v-slot:group.header="h" class="transparent">
            <div class="primary sliced">
              <v-icon dark left>mdi-chevron-right</v-icon>
              <span v-if="h.group && h.group !== 'null'" class="heading white--text text-uppercase">
                <span v-if="Array.isArray(h.group)" v-html="h.group.join(', ')" />
                <span v-else v-html="h.group" />
              </span>
              <span v-else>NONE</span>
            </div>
          </template>
          <template v-slot:item.Name="{ item }">
            <span class="accent--text heading clickable ml-n2" @click="selectedNpc = item">
              <v-menu offset-x left>
                <template v-slot:activator="{ on }">
                  <v-btn icon small class="mt-n1 mr-n2" @click.stop v-on="on">
                    <v-icon small class="fadeSelect">mdi-settings</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="copyNpc(item)">
                    <v-list-item-icon class="ma-0 mr-2 mt-2">
                      <v-icon>mdi-content-copy</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Copy {{ item.Name }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="exportNpc(item)">
                    <v-list-item-icon class="ma-0 mr-2 mt-2">
                      <v-icon>mdi-export-variant</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Export {{ item.Name }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item disabled>
                    <v-list-item-icon class="ma-0 mr-2 mt-2">
                      <v-icon>mdi-printer</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Print NPC Sheet</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="setStatblock(item)">
                    <v-list-item-icon class="ma-0 mr-2 mt-2">
                      <v-icon>mdi-file-document-box</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Generate NPC Statblock</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider />
                  <v-list-item @click="deleteNpc(item)">
                    <v-list-item-icon class="ma-0 mr-2 mt-2">
                      <v-icon color="error">mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="error--text">
                        Delete {{ item.Name }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
              {{ item.Name }}
            </span>
            <v-scroll-x-transition leave-absolute>
              <v-icon v-if="selectedNpc === item" right color="accent">
                mdi-chevron-triple-right
              </v-icon>
            </v-scroll-x-transition>
          </template>
          <template v-slot:item.Class="{ item }">
            <span class="caption text-uppercase">{{ item.Class.Name }}</span>
          </template>
          <template v-slot:item.Role="{ item }">
            <cc-tooltip simple :content="item.Class.Role.toUpperCase()">
              <v-icon large :color="item.Class.Color">{{ item.Class.RoleIcon }}</v-icon>
            </cc-tooltip>
          </template>
          <template v-slot:item.Tier="{ item }">
            <cc-tooltip simple :content="`TIER ${item.Tier} NPC`">
              <v-icon v-if="item.Tier === 'custom'" large color="grey darken-2">
                mdi-star-circle-outline
              </v-icon>
              <v-icon
                v-else
                large
                :color="item.Tier === 1 ? 'grey' : item.Tier === 2 ? 'grey darken-2' : 'black'"
              >
                cci-rank-{{ item.Tier }}
              </v-icon>
            </cc-tooltip>
          </template>
        </v-data-table>
      </v-row>
      <v-divider class="my-2 " />
      <v-row justify="center" dense no-gutters>
        <v-col cols="8">
          <v-btn block tile color="primary" large @click="$router.push({ name: 'new-npc' })">
            <v-icon left>mdi-plus</v-icon>
            Add New NPC
          </v-btn>
        </v-col>
        <v-col cols="8">
          <v-dialog v-model="importDialog" width="50%" persistent>
            <template v-slot:activator="{ on }">
              <v-btn small outlined block tile color="accent" class="mt-1" v-on="on">
                <v-icon left>mdi-application-import</v-icon>
                Import NPC
              </v-btn>
            </template>
            <v-card flat tile>
              <v-card-title>Select File to Import</v-card-title>
              <v-card-text>
                <v-file-input
                  v-model="importNpc"
                  counter
                  label="NPC .JSON File"
                  outlined
                  dense
                  @change="fileImport"
                />
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-btn text @click="importDialog = false">Dismiss</v-btn>
                <v-spacer />
                <v-btn tile color="secondary" :disabled="!importNpc" @click="confirmImport">
                  Confirm
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="statblockDialog" width="50%">
            <cc-titled-panel title="NPC Statblock">
              <v-textarea
                v-if="statblockNpc"
                :value="statblock()"
                auto-grow
                readonly
                outlined
                filled
                class="flavor-text"
              />
            </cc-titled-panel>
          </v-dialog>
        </v-col>
      </v-row>
    </template>
    <template slot="right">
      <npc-card :npc="selectedNpc" />
    </template>
  </panel-view>
</template>

<script lang="ts">
import Vue from 'vue'
import PanelView from '../components/PanelView.vue'
import NpcCard from './NpcCard.vue'
import RosterGroup from './components/RosterGroup.vue'
import { getModule } from 'vuex-module-decorators'
import { NpcStore } from '@/store'
import { Npc, Statblock } from '@/class'
import { INpcData } from '@/interface'
import { importData } from '@/io/Data'
import { saveFile } from '@/io/Dialog'

export default Vue.extend({
  name: 'npc-manager',
  components: { PanelView, NpcCard, RosterGroup },
  data: () => ({
    search: '',
    selectedNpc: null,
    grouping: null,
    headers: [
      { text: 'Name', value: 'Name', align: 'left' },
      { text: 'Class', value: 'Class' },
      { text: 'Role', value: 'Role' },
      { text: 'Tier', value: 'Tier' },
    ],
    npcs: [],
    importDialog: false,
    statblockDialog: false,
    importNpc: null,
    statblockNpc: null,
  }),
  watch: {
    selectedNpc() {
      this.$refs.view.resetScroll()
    },
  },
  created() {
    const store = getModule(NpcStore, this.$store)
    this.npcs = store.Npcs
  },
  methods: {
    setStatblock(npc: Npc) {
      this.statblockNpc = npc
      this.statblockDialog = true
    },
    statblock() {
      return Statblock.GenerateNPC(this.statblockNpc)
    },
    deleteNpc(npc: Npc) {
      this.selectedNpc = null
      const store = getModule(NpcStore, this.$store)
      store.deleteNpc(npc)
    },
    copyNpc(npc: Npc) {
      const store = getModule(NpcStore, this.$store)
      store.cloneNpc(npc)
    },
    exportNpc(npc: Npc) {
      saveFile(
        npc.Name.toUpperCase().replace(/\W/g, '') + '.json',
        JSON.stringify(Npc.Serialize(npc)),
        'Save NPC'
      )
    },
    async fileImport(file) {
      const npcData = await importData<INpcData>(file)
      this.importNpc = Npc.Deserialize(npcData)
      this.importNpc.RenewID()
    },
    confirmImport() {
      const store = getModule(NpcStore, this.$store)
      store.addNpc(this.importNpc)
      this.importNpc = null
      this.importDialog = false
    },
  },
})
</script>

<style>
.v-row-group__header,
.v-row-group__summary {
  background: transparent !important;
}
</style>
