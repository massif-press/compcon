<template>
  <div>
    <action-detail-expander :action="action" />
    <v-divider class="my-3" />
    <v-container v-if="Object.keys(actions).length" style="max-width: 800px">
      <!-- {{ usedArr }} -->
      <div v-for="(k, i) in Object.keys(actions)" :key="`sys_act_${i}`">
        <div class="flavor-text mb-n2 mt-1">{{ k }}</div>
        <item-selector-row
          v-for="(a, j) in actions[k]"
          :key="`action_${j}`"
          :item="a"
          :color="usedArr.includes(j) ? 'grey darken-2' : 'action--quick'"
          @click="activate(a, j)"
        />
        <item-selector-row
          v-if="i === 0"
          key="invade_action"
          :item="invadeAction"
          :color="
            usedArr.includes('invade') ? 'grey darken-2' : 'action--quick'
          "
          @click="$refs.inv_dialog.show()"
        />
      </div>
    </v-container>
    <v-card v-else flat tile class="panel clipped">
      <v-row justify="center" align="center">
        <v-col class="heading h3" style="opacity: 0.3" cols="auto">
          / / NO ACTIONS AVAILABLE / /
        </v-col>
      </v-row>
    </v-card>
    <cc-combat-dialog
      v-if="selected"
      ref="i_dialog"
      :mech="mech"
      :action="selected"
      @use="usedArr.push(index)"
      @undo="removeIdx()"
      @close="commitAction($event)"
    />

    <invade-dialog
      ref="inv_dialog"
      :mech="mech"
      :action="invadeAction"
      @use="usedArr.push('invade')"
      @undo="removeInvade()"
      @close="commitAction($event)"
    />
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import ActionDetailExpander from '../../components/_ActionDetailExpander.vue';
import ItemSelectorRow from '../../components/_ItemSelectorRow.vue';
import InvadeDialog from './_InvadeDialog.vue';

import { ActivationType } from '@/class';

export default {
  name: 'quick-tech-dialog',
  components: { ActionDetailExpander, InvadeDialog, ItemSelectorRow },
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
    selected: null,
    index: -1,
    usedArr: [],
  }),
  computed: {
    invadeAction() {
      return this.state.TechActions.find((x) => x.ID === 'act_invade');
    },
    state() {
      return this.mech.Pilot.State;
    },
    actions() {
      const qtArr = this.state.TechActions.filter(
        (x) =>
          x.Activation === ActivationType.QuickTech && x.ID !== 'act_invade'
      );
      return _.groupBy(qtArr, 'Origin');
    },
  },
  methods: {
    removeIdx() {
      this.usedArr.splice(this.usedArr.indexOf(this.index), 1);
    },
    removeInvade() {
      this.usedArr.splice(this.usedArr.indexOf('invade'), 1);
    },
    commitAction(a) {
      this.state.CommitAction(this.action, a.Activation);
    },
    activate(action, index) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      this.selected = action;
      this.index = index;
      Vue.nextTick()
        .then(() => {
          self.selected = action;
          this.index = index;
        })
        .then(() =>
          Vue.nextTick().then(() => {
            if (self.isInvade) self.$refs.inv_dialog.show();
            else self.$refs.i_dialog.show();
          })
        );
    },
    init() {
      this.selected = null;
      this.index = -1;
      this.usedArr = this.usedArr.splice(0, this.usedArr.length);
    },
  },
};
</script>
