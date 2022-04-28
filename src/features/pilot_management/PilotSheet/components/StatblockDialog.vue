<template>
  <cc-solo-dialog ref="dialog" icon="mdi-text-subject" large no-confirm title="Generate Statblock" @close="clearSelected()">
    <v-card-text>
      <v-select
        v-model="mechSelect"
        :items="pilot.Mechs"
        placeholder="N/A"
        item-text="Name"
        item-value="ID"
        label="Select Mech"
        outlined
        hide-details
      />
      <v-radio-group v-model="genRadios" row mandatory label="Generate:">
        <v-radio label="Mech Build" value="mechBuild"></v-radio>
        <v-radio label="Pilot" value="pilotBuild"></v-radio>
        <v-radio label="Full" value="full"></v-radio>
      </v-radio-group>
      <v-checkbox v-model="discordEmoji" label="Include Pilot NET Discord damage type Emoji (Doesn't work in code block format)" />
      <v-textarea :value="statblock" auto-grow readonly outlined filled class="flavor-text" />
      <cc-tooltip simple inline content="Copy stat block to clipboard">
            <v-btn class="ml-n3" @click="copy()">
              <v-icon>mdi-clipboard-text-outline</v-icon>
              Copy to Clipboard
            </v-btn>
          </cc-tooltip>
    </v-card-text>
  </cc-solo-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop} from 'vue-property-decorator'
import { Mech, Pilot, Statblock } from '@/class'
import CCSoloDialog from '@/ui/components/CCSoloDialog.vue'

@Component({ name: 'statblock-dialog' })
export default class StatblockDialog extends Vue {
  @Prop({type: Object, required: true})
  readonly pilot: Pilot

  selected_mech = null
  discordEmoji = false
  genRadios = 'mechBuild'

  mounted() {
    if (this.mechSelect == null) {this.genRadios='pilotBuild'} 
  }

  get activeMechID(): string {
    return this.pilot.ActiveMech?.ID ?? this.pilot.Mechs[this.pilot.Mechs.length-1]?.ID ?? ''
  }

  get mechSelect(): string {
    return this.selected_mech ?? this.activeMechID
  }

  set mechSelect(mech_id: string) {
    this.selected_mech = mech_id
  }

  get mech(): Mech {
    return this.mechSelect ? this.pilot.Mechs.find(x => x.ID === this.mechSelect) : null
  }

  get statblock(): string {    
    if (this.genRadios != "mechBuild") {
      return Statblock.Generate(this.pilot, this.mech, this.discordEmoji, this.genRadios)
    }
    else return Statblock.GenerateBuildSummary(this.pilot, this.mech, this.discordEmoji)  
  }

  $refs!: {
    dialog: CCSoloDialog
  }

  clearSelected() {
    this.selected_mech = null
  }

  show() {
    this.$refs.dialog.show()
  }
  hide() {
    this.$refs.dialog.hide() 
  }
  copy() {
    navigator.clipboard
      .writeText(this.statblock)
      .then(() => Vue.prototype.$notify('Stat block copied to clipboard.', 'confirmation'))
      .catch(() => Vue.prototype.$notifyError('Unable to copy stat block'))
  }
}
</script>