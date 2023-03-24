<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.display.mdAndDown"
    :style="$vuetify.display.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
  >
    <v-card tile class="background">
      <cc-titlebar large color="action--full">
        <v-icon x-large color="white">mdi-hexagon-slice-6</v-icon>
        Barrage
        <v-btn slot="items" dark icon @click="hide()">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-spacer v-if="$vuetify.display.mdAndDown" class="titlebar-margin" />

      <v-card-text v-if="items.length" class="mb-0 pb-2">
        <div v-for="(item, i) in items" :key="`barrage_item_${item.ID}_${i}`">
          <weapon-attack
            :ref="`main_${i}`"
            :item="item"
            :mech="mech"
            :mount="mounts[i]"
            @confirm="$emit('confirm')"
          >
            <div class="heading h2 mt-3 mb-n3">
              <v-icon x-large class="mt-n2 mr-n1">cc:mech-weapon</v-icon>
              {{ item.Name }}
            </div>
          </weapon-attack>
          <v-container v-if="hasAux(mounts[i], item)">
            <div class="my-3">
              <div class="body-text text-center font-weight-bold">
                You may make an additional attack with the following mounted
                Auxiliary weapon:
                <div class="text-center overline my-n2">
                  This weapon cannot deal bonus damage.
                </div>
              </div>
              <v-alert
                dense
                variant="outlined"
                class="my-1"
                colored-border
                color="primary"
              >
                <weapon-attack
                  :ref="`aux_${i}`"
                  :item="hasAux(mounts[i], item)"
                  :mech="mech"
                  :mount="mounts[i]"
                  aux
                  class="mt-n3"
                >
                  <div class="heading h3 mt-3 mb-n3">
                    <v-icon large class="mt-n2 mr-n1">cc:mech-weapon</v-icon>
                    {{ hasAux(mounts[i], item).Name }}
                  </div>
                </weapon-attack>
              </v-alert>
            </div>
          </v-container>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { WeaponSize } from '@/class';

import WeaponAttack from '../../components/_WeaponAttack.vue';

export default {
  name: 'barrage-dialog',
  components: { WeaponAttack },
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    state() {
      return this.mech.Pilot.State;
    },
    items() {
      return this.state.BarrageSelections;
    },
    mounts() {
      return this.state.BarrageMounts;
    },
  },
  methods: {
    hasAux(mount, primary) {
      const auxes = mount.Weapons.filter((x) => x.Size === WeaponSize.Aux);
      if (!auxes.length) return false;
      const unusedAux = auxes.filter((x) => x !== primary);
      if (!unusedAux.length) return false;
      const candidate = unusedAux[0];
      if (this.items.some((x) => x === candidate)) return false;
      return candidate || false;
    },
    reset() {
      for (let i = 0; i < this.items.length; i++) {
        this.$refs[`main_${i}`].reset();
      }
      for (let i = 0; i < this.auxes.length; i++) {
        this.$refs[`aux_${i}`].reset();
      }
    },
    confirm(): void {
      this.mech.Pilot.State.ClearBarrageSelections();
      this.dialog = false;
      this.$emit('confirm');
    },
    show(): void {
      this.dialog = true;
    },
    hide(): void {
      this.mech.Pilot.State.ClearBarrageSelections();
      this.dialog = false;
      this.$emit('close');
    },
  },
};
</script>
