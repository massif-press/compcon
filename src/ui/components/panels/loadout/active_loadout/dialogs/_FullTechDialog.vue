<template>
  <div class="pt-2">
    <action-detail-expander :action="action" />
    <v-divider class="my-3" />
    <v-container style="max-width: 800px">
      <div v-for="(k, i) in Object.keys(quickActions)" :key="`sys_act_${i}`">
        <div class="flavor-text mb-n2 mt-1">{{ k }}</div>
        <item-selector-row
          v-for="(a, j) in quickActions[k]"
          :key="`action_${j}`"
          :item="a"
          :disabled="quick.length === 2"
          @click="addQuick(a)"
        />
        <item-selector-row
          :item="invadeAction"
          :disabled="quick.length === 2"
          @click="openInvade()"
        />
      </div>
    </v-container>
    <v-divider v-if="Object.keys(fullActions).length" class="my-3" />
    <v-container v-if="Object.keys(fullActions).length" style="max-width: 800px">
      <div v-for="(k, i) in Object.keys(fullActions)" :key="`sys_act_${i}`">
        <div class="flavor-text mb-n2 mt-1">{{ k }}</div>
        <item-selector-row
          v-for="(a, j) in fullActions[k]"
          :key="`action_${j}`"
          :item="a"
          :disabled="quick.length > 0"
          @click="activate(a)"
        />
      </div>
    </v-container>

    <v-card-text>
      <v-slide-x-reverse-transition group>
        <v-row
          v-for="(q, i) in quick"
          :key="`quick_sel_${i}`"
          dense
          justify="center"
          align="center"
        >
          <v-col>
            <v-alert v-if="q === 'invade-fail'" dense outlined color="white" class="text-center">
              <span class="heading h3 text-disabled">INVASION ATTEMPT FAILED</span>
            </v-alert>
            <cc-action v-else panel :action="q" />
          </v-col>
          <v-col cols="auto">
            <v-btn x-large icon @click="removeQuick(i)"><v-icon x-large>mdi-close</v-icon></v-btn>
          </v-col>
        </v-row>
      </v-slide-x-reverse-transition>

      <v-slide-x-reverse-transition>
        <v-row v-if="quick.length === 2" dense justify="center">
          <v-col lg="6" md="10" xs="12">
            <v-btn block x-large color="primary" :disabled="used" @click="$emit('use')">
              {{ !used ? 'CONFIRM' : 'ACTION CONFIRMED' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-slide-x-reverse-transition>
    </v-card-text>
    <invade-dialog
      ref="inv_dialog"
      fulltech
      :mech="mech"
      :action="invadeAction"
      @add-invade="quick.push($event)"
      @add-fail="quick.push('invade-fail')"
    />
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import ActionDetailExpander from '../components/_ActionDetailExpander.vue'
import ItemSelectorRow from '../components/_ItemSelectorRow.vue'
import InvadeDialog from './_InvadeDialog.vue'

import Vue from 'vue'
import { ActivationType } from '@/classes/enums'

export default Vue.extend({
  name: 'full-tech-dialog',
  components: { ActionDetailExpander, ItemSelectorRow, InvadeDialog },
  props: {
    used: { type: Boolean },
    mech: {
      type: Object,
      required: true,
    },
    action: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    quick: [],
  }),
  computed: {
    state() {
      return this.mech.Pilot.State
    },
    invadeAction() {
      return this.state.TechActions.find(x => x.ID === 'act_invade')
    },
    quickActions() {
      const qtArr = this.state.TechActions.filter(
        x => x.Activation === ActivationType.QuickTech && x.ID !== 'act_invade'
      )
      return _.groupBy(qtArr, 'Origin')
    },
    fullActions() {
      return _.groupBy(
        this.state.TechActions.filter(x => x.Activation === ActivationType.FullTech),
        'Origin'
      )
    },
  },
  watch: {
    used: {
      immediate: true,
      deep: true,
      handler: function(newval) {
        if (!newval) this.quick = []
      },
    },
  },
  methods: {
    init() {
      this.quick = this.quick.splice(0, this.quick.length)
    },
    addQuick(action) {
      if (this.quick.length < 2) this.quick.push(action)
    },
    removeQuick(idx) {
      this.quick.splice(idx, 1)
    },
    openInvade() {
      this.$refs.inv_dialog.init()
      this.$refs.inv_dialog.show()
    },
  },
})
</script>
