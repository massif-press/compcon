<template>
  <v-expansion-panel-content>
    <v-toolbar-title slot="header" v-if="licenseData.err" dense>
      <span class="subheading grey--text">// MISSING DATA //</span>
      &emsp;
    </v-toolbar-title>

    <v-toolbar-title slot="header" v-else dense>
      <v-icon color="primary" v-html="`cc-rank-${pilotRank}`" />
      <span class="title">{{ licenseData.Name }}</span>
      <span class="caption">({{ licenseData.Source }})</span>
    </v-toolbar-title>
    <v-card>
      <v-layout v-if="selectable && available" class="text-xs-center">
        <v-flex v-if="!pilotRank" class="ma-2 ml-5 mr-5">
          <v-btn @click="add" color="primary" large block>unlock rank I</v-btn>
        </v-flex>
        <v-flex v-else-if="pilotRank === 1" class="ma-2 ml-5 mr-5">
          <v-btn @click="add" color="primary" large block>unlock rank II</v-btn>
        </v-flex>
        <v-flex v-else-if="pilotRank === 2" class="ma-2 ml-5 mr-5">
          <v-btn @click="add" color="primary" large block>
            unlock rank III
          </v-btn>
        </v-flex>
      </v-layout>
      <license-card
        v-if="!licenseData.err"
        :license="licenseData"
        :rank="pilotRank"
      />
      <v-layout v-if="selectable" class="text-xs-center">
        <v-flex v-if="pilotRank === 1" class="ma-2">
          <v-btn @click="remove" flat color="warning" block>
            remove rank I
          </v-btn>
        </v-flex>
        <v-flex v-else-if="pilotRank === 2" class="ma-2">
          <v-btn @click="remove" flat color="warning" block>
            remove rank II
          </v-btn>
        </v-flex>
        <v-flex v-else-if="pilotRank === 3" class="ma-2">
          <v-btn @click="remove" flat color="warning" block>
            remove rank III
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card>
  </v-expansion-panel-content>
</template>

<script lang="ts">
import Vue from 'vue'
import { LicenseCard } from '../../components/UI'

export default Vue.extend({
  name: 'license-item',
  components: { LicenseCard },
  props: {
    pilotRank: Number,
    licenseData: Object,
    selectable: Boolean,
    available: Boolean,
  },
  data: () => ({
    modal: false,
  }),
  methods: {
    add() {
      this.$emit('add')
    },
    remove() {
      this.$emit('remove')
    },
  },
})
</script>
