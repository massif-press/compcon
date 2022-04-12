<template>
  <cc-solo-dialog ref="dialog" icon="mdi-text-subject" large no-confirm title="Generate Statblock">
    <v-card-text>
      <!-- <div v-if="!!mechSelect">
        <v-checkbox v-model="fullBuild" label="Full Pilot + Mech Build" />
      </div> -->
      <v-radio-group v-model="genRadios" row mandatory label="Generate:">
        <v-radio label="Mech Build" value="mech"></v-radio>
        <v-radio label="Pilot" value="pilot"></v-radio>
        <v-radio label="Both" value="full"></v-radio>
      </v-radio-group>
      <v-select 
        v-if="genRadios!='pilot'"
        v-model="mechSelect"
        :items="pilot.Mechs"
        placeholder="N/A"
        item-text="Name"
        item-value="ID"
        label="Select Mech"
        outlined
        hide-details
      />
      <v-checkbox v-model="discordEmoji" label="Enhance with Pilot NET Discord Emoji (Doesn't work in code block formatting)" />
      <v-textarea :value="statblock" auto-grow readonly outlined filled class="flavor-text" />
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

  //ideally: grabs mech from editing page if open, else active mech, else latest mech.
  // Doesn't seem to like if statments here though.
  mechSelect = ""
  // vvv code to make pilot's latest mech default. Puts the text in the dropdown but doesn't set "const mech" for some reason.
  // mechSelect = this.pilot.Mechs[this.pilot.Mechs.length-1]
  genRadios = "pilot"
  discordEmoji = false

  get statblock(): string {
    const mech = this.mechSelect ? this.pilot.Mechs.find(x => x.ID === this.mechSelect) : null
    if (this.genRadios == "mech") {
      return Statblock.GenerateBuildSummary(this.pilot, mech, this.discordEmoji)    
    }
    else if (this.genRadios == "pilot") {
      return Statblock.Generate(this.pilot, mech, this.discordEmoji, false)
    }
    else return Statblock.Generate(this.pilot, mech, this.discordEmoji, true)
    }


  $refs!: {
    dialog: CCSoloDialog
  }

  show() {
    this.$refs.dialog.show()
  }

  hide() {
    this.$refs.dialog.hide()
  }
}
</script>
