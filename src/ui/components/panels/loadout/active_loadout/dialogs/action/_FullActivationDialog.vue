<template>
  <div>
    <action-detail-expander :action="action" />
    <v-divider class="mt-3" />
    <v-container v-if="Object.keys(actions).length" style="max-width: 800px">
      <div v-for="(k, i) in Object.keys(actions)" :key="`sys_act_${i}`">
        <div class="flavor-text mb-n2 mt-1">{{ k }}</div>
        <item-selector-row
          v-for="(a, j) in actions[k]"
          :key="`action_${j}`"
          :item="a"
          @click="activate(a)"
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
      @close="hide()"
    />
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import ActionDetailExpander from '../../components/_ActionDetailExpander.vue';
import ItemSelectorRow from '../../components/_ItemSelectorRow.vue';

export default {
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
    selected: null,
  }),
  computed: {
    state() {
      return this.mech.Pilot.State;
    },
    actions() {
      const availableActions = this.state
        .ItemActions('Full')
        .filter((x) => this.state.AvailableActions.includes(x.ID));
      return _.groupBy(availableActions, 'Origin');
    },
  },
  methods: {
    activate(action) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      this.selected = action;
      Vue.nextTick()
        .then(() => (self.selected = action))
        .then(() => Vue.nextTick().then(() => self.$refs.i_dialog.show()));
    },
    init() {
      this.selected = null;
    },
  },
};
</script>
