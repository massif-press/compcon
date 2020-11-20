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
            <cc-action panel :action="q" />
          </v-col>
          <v-col cols="auto">
            <v-btn x-large icon @click="removeQuick(i)"><v-icon x-large>mdi-close</v-icon></v-btn>
          </v-col>
        </v-row>
      </v-slide-x-reverse-transition>

      <v-slide-x-reverse-transition>
        <v-row v-if="quick.length === 2" dense justify="center">
          <v-col lg="6" md="10" xs="12">
            <v-btn block x-large color="primary" :disabled="finished" @click="complete()">
              {{ !finished ? 'CONFIRM' : 'ACTION CONFIRMED' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-slide-x-reverse-transition>

      <v-slide-x-reverse-transition>
        <v-row v-if="finished">
          <v-col cols="auto" class="ml-auto">
            <cc-tooltip content="Undo this action, refunding any cost it may have had">
              <v-btn x-small color="primary" class="fadeSelect" @click="undo()">
                <v-icon small left>mdi-reload</v-icon>
                UNDO
              </v-btn>
            </cc-tooltip>
          </v-col>
        </v-row>
      </v-slide-x-reverse-transition>
    </v-card-text>

    <cc-combat-dialog ref="i_dialog" :mech="mech" :action="selected" @close="hide()" />
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import ActionDetailExpander from '../components/_ActionDetailExpander.vue'
import ItemSelectorRow from '../components/_ItemSelectorRow.vue'

import Vue from 'vue'
import { ActivationType } from '@/classes/enums'

export default Vue.extend({
  name: 'full-activation-dialog',
  components: { ActionDetailExpander, ItemSelectorRow },
  props: {
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
    selected: null,
    finished: false,
  }),
  computed: {
    state() {
      return this.mech.Pilot.State
    },
    quickActions() {
      return _.groupBy(
        this.state.TechActions.filter(x => x.Activation === ActivationType.QuickTech),
        'Origin'
      )
    },
    fullActions() {
      return _.groupBy(
        this.state.TechActions.filter(x => x.Activation === ActivationType.FullTech),
        'Origin'
      )
    },
  },
  created() {
    this.selected = this.action
  },
  methods: {
    complete() {
      this.finished = true
      this.mech.Pilot.State.CommitAction(this.action, ActivationType.Full)
    },
    undo() {
      this.quick = []
      this.selected = null
      this.finished = false
      this.mech.Pilot.State.UndoAction(this.action, ActivationType.Full)
    },
    addQuick(action) {
      if (this.quick.length < 2) this.quick.push(action)
    },
    removeQuick(idx) {
      this.quick.splice(idx, 1)
    },
    activate(action) {
      this.selected = action
      this.$refs.i_dialog.show()
    },
  },
})
</script>
