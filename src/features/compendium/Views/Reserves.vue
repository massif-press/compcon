<template>
  <div>
    <h1 v-resize-text="{ maxFontSize: '36pt' }" class="heading mb-3 ml-5">RESERVES</h1>
    <v-tabs
      v-model="tabModel"
      background-color="primary"
      :slider-size="6"
      slider-color="active"
      fixed-tabs
    >
      <v-tab v-for="(k, i) in Object.keys(reserves)" :key="'tab_' + k + i" ripple>
        {{ k }}
      </v-tab>
      <v-tab-item v-for="(k, i) in Object.keys(reserves)" :key="'titem_' + k + i + 'desc'">
        <v-container>
          <v-row justify="center">
            <reserve-card v-for="r in reserves[k]" :key="r.ID" :reserve="r" />
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ReserveCard from '../components/ReserveCard.vue'
import Component from 'vue-class-component'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { Reserve } from '@/class'
import _, { Dictionary } from 'lodash'

@Component({
  components: { ReserveCard },
})
export default class Reserves extends Vue {
  tabModel: 0
  private compendium = getModule(CompendiumStore, this.$store)
  get reserves(): Dictionary<Reserve[]> {
    return _.groupBy(this.compendium.Reserves, 'Type')
  }
}
</script>
