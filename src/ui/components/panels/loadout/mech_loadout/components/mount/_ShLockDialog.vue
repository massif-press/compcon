<template>
  <v-dialog v-model="dialog" width="50vw">
    <v-card tile>
      <cc-titlebar large icon="cc:role-striker" color="primary">
        Select Bracing Mount
        <v-btn slot="items" dark icon @click="dialog = false">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>
      <v-card-text class="text-center flavor-text mt-2">
        <span class="text-overline">// PROCESS INTERRUPT: PILOT INPUT REQUIRED //</span>
        <br />
        //[COMP/CON:
        <b class="text-stark">
          Lancer, Superheavy-class armament requires two mounts. Please select a
          <span class="text-accent">bracing mount.</span>
          This bracing mount will be not be able to field armament until the Superheavy weapon is
          removed.
        </b>
        ]
        <br />
        <v-btn
          v-for="m in availableMounts"
          x-large
          block
          variant="outlined"
          color="accent"
          class="my-2"
          @click="$emit('select', m)"
        >
          {{ m.Name }}
        </v-btn>
        <div v-if="superheavySelect">
          <i>The SUPERHEAVY MOUNTING Core Bonus requires bracing on a Heavy Mount, if available.</i>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">dismiss</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { EquippableMount } from '@/class';

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
    availableMounts: [],
  }),
  mounted() {
    let candidates = this.mech.MechLoadoutController.ActiveLoadout.AllEquippableMounts(
      this.mech.Pilot.has('corebonus', 'cb_improved_armament'),
      false
    ) as EquippableMount[];
    if (this.superheavySelect) {
      candidates = this.mech.MechLoadoutController.ActiveLoadout.Mounts.filter(
        (m) => m.Type === MountType.Heavy
      );
    }
    this.availableMounts = candidates.filter((x) => x.Name !== this.mount.Name);
  },
  computed: {
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
