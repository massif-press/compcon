<template>
  <div>
    <h1 class="heading mb-3 ml-5">RESERVES</h1>
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
            <v-col v-for="reserve in reserves[k]" :key="reserve.ID" lg="4" md="6" sm="12">
              <reserve-card :item="reserve"/>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import ReserveCard from '@/ui/components/cards/_ReserveCard.vue'
import _ from 'lodash'

export default Vue.extend({
  name: 'reserves',
  components: { ReserveCard },
  data: () => ({
    tabModel: 0,
  }),
  computed: {
    reserves() {
      const compendium = getModule(CompendiumStore, this.$store)
      return _.groupBy(
        compendium.Reserves.filter(x => x),
        'Type'
      )
    },
  },
})
</script>
