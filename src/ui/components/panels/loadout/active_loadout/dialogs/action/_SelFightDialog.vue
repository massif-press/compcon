<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.display.mdAndDown"
    :style="$vuetify.display.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
  >
    <v-card tile class="background">
      <cc-titlebar large color="action--quick">
        <v-icon x-large>mdi-hexagon-slice-6</v-icon>
        Fight
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-spacer v-if="$vuetify.display.mdAndDown" class="titlebar-margin" />

      <v-card-text v-if="item" class="mb-0 pb-2">
        <pilot-attack
          ref="main"
          :item="item"
          :pilot="pilot"
          :overwatch="overwatch"
          class="mt-4"
        >
          <div class="heading h2 mt-3 mb-n3">
            <v-icon x-large class="mt-n2 mr-n1">cc:pilot</v-icon>
            {{ item.Name }}
          </div>
        </pilot-attack>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import PilotAttack from '../../components/_PilotAttack.vue';

export default {
  name: 'selected-fight-dialog',
  components: { PilotAttack },
  props: {
    item: {
      type: Object,
      required: false,
      default: null,
    },
    pilot: {
      type: Object,
      required: true,
    },
    overwatch: { type: Boolean },
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    reset() {
      (this.$refs.main as any).reset();
    },
    confirm(): void {
      this.dialog = false;
      this.$emit('close');
      (this.$refs.main as any).init();
    },
    show(): void {
      this.dialog = true;
    },
    hide(): void {
      this.dialog = false;
      this.$emit('close');
      (this.$refs.main as any).init();
    },
  },
};
</script>
