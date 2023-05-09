<template>
  <div>
    <h1 class="heading mb-3 ml-5">RESERVES</h1>
    <v-tabs v-model="tab" background-color="primary" slider-color="active" fixed-tabs>
      <v-tab v-for="k in Object.keys(reserves)" ripple>
        {{ k }}
      </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item v-for="k in Object.keys(reserves)">
        <v-container fluid>
          <v-row justify="center">
            <v-col v-for="reserve in reserves[k]" lg="4" md="6" sm="12">
              <cc-reserve-card :item="reserve" />
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
    </v-window>
  </div>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import _ from 'lodash';

export default {
  name: 'reserves',
  data: () => ({
    tab: 0,
  }),
  computed: {
    reserves() {
      return _.groupBy(
        CompendiumStore().Reserves.filter((x) => x),
        'Type'
      );
    },
  },
};
</script>
