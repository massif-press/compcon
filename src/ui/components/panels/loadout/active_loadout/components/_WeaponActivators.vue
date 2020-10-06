<template>
  <div>
    <v-row v-if="item.Size === 'Superheavy'">
      <v-col>
        <v-btn tile block color="action--full">
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
          :disabled="!barrageToggle && barrageCount === 2"
          @click="setBarrage()"
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
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SkirmishDialog from '../dialogs/_SkirmishDialog.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'weapon-activators',
  components: { SkirmishDialog },
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
  data: () => ({
    barrageToggle: false,
  }),
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
  },
  methods: {
    setBarrage() {
      if (this.barrageCount < 2 && !this.barrageToggle) {
        this.barrageToggle = true
        this.state.SelectBarrage(this.item)
      } else {
        this.barrageToggle = false
        this.state.RemoveBarrage(this.item)
      }
    },
  },
})
</script>
