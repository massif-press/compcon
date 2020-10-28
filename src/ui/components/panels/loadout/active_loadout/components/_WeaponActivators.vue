<template>
  <div>
    <v-row v-if="item.Size === 'Superheavy'">
      <v-col>
        <v-btn
          tile
          block
          color="action--full"
          :disabled="!!barrageCount"
          @click="setBarrage(item, mount)"
        >
          <v-icon left>mdi-hexagon-slice-6</v-icon>
          barrage
          <v-menu offset-y max-width="700px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn style="position:absolute; right: 0" icon v-bind="attrs" v-on="on">
                <v-icon class="fadeSelect">
                  mdi-information-outline
                </v-icon>
              </v-btn>
            </template>
            <v-card>
              <div class="heading h3 ma-1 pl-3">BARRAGE &mdash; FULL ACTION</div>
              <v-divider />
              <v-card-text class="body-text text--text mt-0 pt-1" v-html="barrageHelp" />
            </v-card>
          </v-menu>
        </v-btn>
      </v-col>
      <v-col v-for="(a, i) in item.Actions" :key="`${item.Name}_action_${i}`">
        <cc-action :action="a" active />
      </v-col>
    </v-row>
    <v-row v-else dense>
      <v-col>
        <v-btn tile block color="action--quick" @click="$refs.sk_dialog.show()">
          <v-icon left>mdi-hexagon-slice-3</v-icon>
          skirmish
          <v-menu offset-y max-width="700px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn style="position:absolute; right: 0" icon v-bind="attrs" v-on="on">
                <v-icon class="fadeSelect">
                  mdi-information-outline
                </v-icon>
              </v-btn>
            </template>
            <v-card>
              <div class="heading h3 ma-1 pl-3">SKIRMISH &mdash; QUICK ACTION</div>
              <v-divider />
              <v-card-text class="body-text text--text mt-0 pt-1" v-html="skirmishHelp" />
            </v-card>
          </v-menu>
        </v-btn>
        <skirmish-dialog ref="sk_dialog" :item="item" :mech="mech" :mount="mount" />
      </v-col>
      <v-col>
        <v-btn
          tile
          block
          :color="barrageToggle ? 'secondary' : 'action--full'"
          :disabled="barrageDisabled"
          @click="setBarrage(item, mount)"
        >
          <v-icon left>mdi-hexagon-slice-6</v-icon>
          barrage
          <span v-if="barrageToggle">({{ barrageCount }}/2)</span>
          <v-menu offset-y max-width="700px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn style="position:absolute; right: 0" icon v-bind="attrs" v-on="on">
                <v-icon class="fadeSelect">
                  mdi-information-outline
                </v-icon>
              </v-btn>
            </template>
            <v-card>
              <div class="heading h3 ma-1 pl-3">BARRAGE &mdash; FULL ACTION</div>
              <v-divider />
              <v-card-text class="body-text text--text mt-0 pt-1" v-html="barrageHelp" />
            </v-card>
          </v-menu>
        </v-btn>
      </v-col>
      <v-col v-for="(a, i) in item.Actions" :key="`${item.Name}_action_${i}`">
        <cc-action :action="a" active />
      </v-col>
      <barrage-dialog
        ref="b_dialog"
        :items="state.BarrageSelections"
        :mech="mech"
        :mounts="state.BarrageMounts"
      />
    </v-row>
    <sh-barrage-dialog ref="sh_b_dialog" :mech="mech" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SkirmishDialog from '../dialogs/_SelSkirmishDialog.vue'
import BarrageDialog from '../dialogs/_SelBarrageDialog.vue'
import ShBarrageDialog from '../dialogs/_SelSHBarrageDialog.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { WeaponSize } from '@/class'

export default Vue.extend({
  name: 'weapon-activators',
  components: { SkirmishDialog, BarrageDialog, ShBarrageDialog },
  props: {
    item: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
    mount: {
      type: Object,
      required: true,
    },
  },
  computed: {
    state() {
      return this.mech.Pilot.State
    },
    compendium() {
      return getModule(CompendiumStore, this.$store)
    },
    barrageCount() {
      return this.state.BarrageSelections.length
    },
    skirmishHelp() {
      return this.compendium.Actions.find(x => x.ID === 'act_skirmish').Detail
    },
    barrageHelp() {
      return this.compendium.Actions.find(x => x.ID === 'act_barrage').Detail
    },
    barrageToggle() {
      return this.state.BarrageSelections.some(x => x === this.item)
    },
    barrageDisabled() {
      if (this.item.Size === WeaponSize.Superheavy) return this.barrageCount > 0
      return !this.barrageToggle && this.barrageCount === 2
    },
  },
  methods: {
    setBarrage(item, mount) {
      if (this.item.Size === WeaponSize.Superheavy) {
        this.state.SelectShBarrage(item, mount)
        this.$refs.sh_b_dialog.show()
      } else if (this.barrageCount < 2 && !this.barrageToggle) {
        this.state.SelectBarrage(item, mount)
        if (this.barrageCount === 2) {
          this.$refs.b_dialog.show()
        }
      } else {
        this.state.RemoveBarrage(item, mount)
      }
    },
  },
})
</script>
