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
      <v-divider class="my-2" />
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
          <template v-slot:[`group.header`]="h" class="transparent">
            <div class="primary sliced">
              <v-icon dark left>mdi-chevron-right</v-icon>
              <span v-if="h.group && h.group !== 'null'" class="heading white--text text-uppercase">
                <span v-if="Array.isArray(h.group)" v-html="h.group.join(', ')" />
                <span v-else v-html="h.group" />
              </span>
              <span v-else>NONE</span>
            </div>
          </template>
          <template v-slot:[`item.Name`]="{ item }">
            <span class="accent--text heading clickable ml-n2" @click="selectedNpc = item">
              <v-menu offset-x left>
                <template v-slot:activator="{ on }">
                  <v-btn icon small class="mt-n1 mr-n2" @click.stop v-on="on">
                    <v-icon small class="fadeSelect">mdi-cog</v-icon>
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
                  <v-list-item @click="printNpc(item)">
                    <v-list-item-icon class="ma-0 mr-2 mt-2">
                      <v-icon>mdi-printer</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Print NPC Sheet</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="setStatblock(item)">
                    <v-list-item-icon class="ma-0 mr-2 mt-2">
                      <v-icon>mdi-file-document-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Generate NPC Statblock</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider />
                  <v-list-item @click="delete_npc(item)">
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
          <template v-slot:[`item.Class`]="{ item }">
            <span class="caption text-uppercase">{{ item.Class.Name }}</span>
          </template>
          <template v-slot:[`item.Role`]="{ item }">
            <cc-tooltip simple :content="item.Class.Role.toUpperCase()">
              <v-icon large :color="item.Class.Color">{{ item.Class.RoleIcon }}</v-icon>
            </cc-tooltip>
          </template>
          <template v-slot:[`item.Tier`]="{ item }">
            <cc-tooltip simple :content="`TIER ${item.Tier} NPC`">
              <v-icon v-if="item.Tier === 'custom'" large color="grey darken-2">
                mdi-star-circle-outline
              </v-icon>
              <v-icon
                v-else
                large
                color="accent"
                :style="`opacity: ${item.Tier === 1 ? '0.55' : item.Tier === 2 ? '0.75' : '1'}`"
              >
                cci-rank-{{ item.Tier }}
              </v-icon>
            </cc-tooltip>
          </template>
        </v-data-table>
      </v-row>
      <v-divider class="my-2" />
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
                  v-model="npcImportFile"
                  counter
                  label="NPC .JSON File"
                  outlined
                  dense
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
              <v-radio-group v-model="genRadios" row mandatory label="Generate:">
                <v-radio label="Compact" value="compact"></v-radio>
                <v-radio label="Detailed" value="detailed"></v-radio>
              </v-radio-group>
              <v-textarea
                v-if="statblockNpc"
                :value="statblock()"
                auto-grow
                readonly
                outlined
                filled
                class="flavor-text"
              />
              <cc-tooltip simple inline content="Copy stat block to clipboard">
                <v-btn class="mt-n4" color="accent" @click="copyStatBlock()">
                  <v-icon>mdi-clipboard-text-outline</v-icon>
                  Copy to Clipboard
                </v-btn>
              </cc-tooltip>
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
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Vue, Component, Watch } from 'vue-property-decorator'
import PanelView from '../components/PanelView.vue'
import NpcCard from './NpcCard.vue'
import RosterGroup from './components/RosterGroup.vue'
import { getModule } from 'vuex-module-decorators'
import { NpcStore } from '@/store'
import { Npc, Statblock } from '@/class'
import { INpcData } from '@/interface'
import { importData } from '@/io/Data'
import { saveFile } from '@/io/Dialog'

@Component({
  name: 'npc-manager',
  components: { PanelView, NpcCard, RosterGroup },
})
export default class NpcManager extends Vue {
  search = ''
  selectedNpc: Npc = null
  grouping = null
  headers = [
    { text: 'Name', value: 'Name', align: 'left' },
    { text: 'Class', value: 'Class.Name' },
    { text: 'Role', value: 'Role' },
    { text: 'Tier', value: 'Tier' },
  ]
  importDialog = false
  statblockDialog = false
  npcImportFile: File = null
  importNpc: Npc = null
  statblockNpc = null
  genRadios = 'compact'

  @Watch('selectedNpc')
  onSelectedNpcChanged() {
    // this.$refs.view.resetScroll()
  }

  created() {
    const store = getModule(NpcStore, this.$store)
    this.npcs = store.Npcs
  }

  npcs = getModule(NpcStore, this.$store).Npcs

  setStatblock(npc: Npc) {
    this.statblockNpc = npc
    this.statblockDialog = true
  }

  statblock() {
    return Statblock.GenerateNPC(this.statblockNpc, this.genRadios)
  }

  copyStatBlock() {
    navigator.clipboard
      .writeText(this.statblock())
      .then(() => Vue.prototype.$notify('Stat block copied to clipboard.', 'confirmation'))
      .catch(() => Vue.prototype.$notifyError('Unable to copy stat block'))
  }

  delete_npc(npc: Npc) {
    this.selectedNpc = null
    npc.SaveController.delete()
  }

  copyNpc(npc: Npc) {
    const store = getModule(NpcStore, this.$store)
    store.cloneNpc(npc)
  }

  exportNpc(npc: Npc) {
    saveFile(
      npc.Name.toUpperCase().replace(/\W/g, '') + '.json',
      JSON.stringify(Npc.Serialize(npc)),
      'Save NPC'
    )
  }

  printNpc(npc: Npc) {
    this.$router.push(`/printNpc/${npc.ID}`)
  }

  @Watch('npcImportFile')
  async fileImport(file) {
    if (!file) return
    const npcData = await importData<INpcData>(file)
    this.importNpc = Npc.Deserialize(npcData)
    this.importNpc.RenewID()
  }

  confirmImport() {
    const store = getModule(NpcStore, this.$store)
    store.addNpc(this.importNpc)
    this.importNpc = null
    this.importDialog = false
    this.npcImportFile = null
  }
}
</script>

<style>
.v-row-group__header,
.v-row-group__summary {
  background: transparent !important;
}
</style>
