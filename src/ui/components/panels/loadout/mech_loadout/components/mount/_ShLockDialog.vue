<template>
  <cc-solo-modal
    v-model="dialog"
    width="50vw"
    shrink
    icon="cc:role_striker"
    title="Select Bracing Mount">
    <v-card-text class="text-center pt-0">
      <span class="text-cc-overline">// PROCESS INTERRUPT: AUTHORIZATION REQUIRED //</span>
      <div class="flavor-text">
        <span style="opacity: 0.4">>>COMP/CON//&nbsp;</span>
        <span>
          Lancer, Superheavy-class armament requires two mounts. Please select a
          <span class="text-accent">bracing mount.</span>
          This bracing mount will be not be able to field armament until the Superheavy weapon is
          removed.
        </span>
      </div>
      <div class="heading">
        <cc-button
          v-for="m in availableMounts"
          x-large
          block
          variant="outlined"
          color="accent"
          class="my-2"
          @click="$emit('select', m)">
          {{ m.Name }}
        </cc-button>
      </div>
      <div v-if="superheavySelect">
        <i>The SUPERHEAVY MOUNTING Core Bonus requires bracing on a Heavy Mount, if available.</i>
      </div>
    </v-card-text>
  </cc-solo-modal>
</template>

<script lang="ts">
import { EquippableMount, MountType } from '@/class';

export default {
  name: 'sh-lock-dialog',
  props: {
    mech: {
      type: Object,
      required: true,
    },
    mount: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    availableMounts() {
      let candidates = this.mech.MechLoadoutController.ActiveLoadout.AllEquippableMounts(
        this.mech.Pilot.has('corebonus', 'cb_improved_armament'),
        false
      ) as EquippableMount[];
      if (this.superheavySelect) {
        candidates = this.mech.MechLoadoutController.ActiveLoadout.Mounts.filter(
          (m) => m.Type === MountType.Heavy
        );
      }
      return candidates.filter((x) => x.Name !== this.mount.Name);
    },
    superheavySelect() {
      return (
        this.mech.Pilot.has('corebonus', 'cb_superheavy_mounting') &&
        this.mech.MechLoadoutController.ActiveLoadout.Mounts.some(
          (m) => m.Type === MountType.Heavy
        ) &&
        this.mount.Type !== MountType.Heavy
      );
    },
  },
  methods: {
    show() {
      this.dialog = true;
    },
    hide() {
      this.dialog = false;
    },
  },
};
</script>
