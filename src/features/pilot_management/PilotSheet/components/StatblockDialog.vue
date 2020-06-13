<template>
  <cc-solo-dialog ref="dialog" icon="mdi-text-subject" large no-confirm title="Pilot Statblock">
    <v-card-text>
      <v-select
        v-model="mechSelect"
        :items="pilot.Mechs"
        placeholder="N/A"
        item-text="Name"
        item-value="ID"
        label="Include Mech (optional)"
        outlined
        clearable
        hide-details
      />
      <div v-if="!!mechSelect">
        <v-checkbox v-model="buildSummary" label="Compact / Build Summary" />
      </div>
      <v-checkbox v-model="discordEmoji" label="Enhance with Pilot NET Discord Emoji" />
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

  mechSelect = ""
  buildSummary = false
  discordEmoji = false

  get statblock(): string {
    const mech = this.mechSelect ? this.pilot.Mechs.find(x => x.ID === this.mechSelect) : null
    if (this.buildSummary) {
      return Statblock.GenerateBuildSummary(this.pilot, mech, this.discordEmoji)
    }
    else return Statblock.Generate(this.pilot, mech, this.discordEmoji)
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
