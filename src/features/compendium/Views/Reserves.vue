<template>
  <div>
    <h1 v-resize-text="{ maxFontSize: '36pt' }" class="heading mb-3 ml-5">RESERVES & DOWNTIME</h1>
    <v-tabs
      v-model="tabModel"
      background-color="primary"
      :slider-size="12"
      slider-color="active"
      fixed-tabs
    >
      <v-tab v-for="(k, i) in Object.keys(reserves)" :key="'tab_' + k + i" ripple>
        {{ k }}
      </v-tab>
      <v-tab ripple>
        Downtime Actions
      </v-tab>
      <v-tab-item v-for="(k, i) in Object.keys(reserves)" :key="'titem_' + k + i + 'desc'">
        <v-container grid-list-md fluid>
          <v-row wrap fill-height justify="center">
            <reserve-card v-for="r in reserves[k]" :key="r.ID" :reserve="r" />
          </v-row>
        </v-container>
      </v-tab-item>
      <v-tab-item v-for="(k, i) in Object.keys(reserves)" :key="'stitem_' + k + i + 'desc'">
        <v-container grid-list-md fluid>
          <v-row wrap fill-height justify="center">
            <action-card v-for="a in downtimeActions" :key="a.id" :action="a" downtime />
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import ActionCard from '../components/ActionCard.vue'
import ReserveCard from '../components/ReserveCard.vue'
import { actions, reserves } from 'lancer-data'

export default Vue.extend({
  name: 'reference',
  components: { ActionCard, ReserveCard },
  data: () => ({
    tabModel: 0,
    downtimeActions: [],
    reserves: [],
  }),
  created() {
    this.reserves = _.groupBy(reserves, 'type')
    this.downtimeActions = actions.filter(x => x.action_type === 'downtime')
  },
})
</script>
