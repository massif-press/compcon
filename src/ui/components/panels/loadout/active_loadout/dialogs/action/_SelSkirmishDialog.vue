<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.display.mdAndDown"
    :style="$vuetify.display.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
  >
    <v-card tile class="background">
      <cc-titlebar v-if="overwatch" large color="action--reaction">
        <v-icon x-large>cc:reaction</v-icon>
        Overwatch
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>
      <cc-titlebar v-else large color="action--quick">
        <v-icon x-large color="white">mdi-hexagon-slice-3</v-icon>
        Skirmish
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-spacer v-if="$vuetify.display.mdAndDown" class="titlebar-margin" />

      <v-card-text v-if="item && mount" class="mb-0 pb-2">
        <weapon-attack
          ref="main"
          :item="item"
          :mech="mech"
          :mount="mount"
          :overwatch="overwatch"
          @confirm="confirmAttack($event)"
        >
          <div class="heading h2 mt-3 mb-n3">
            <v-icon x-large class="mt-n2 mr-n1">cc:mech-weapon</v-icon>
            {{ item.Name }}
          </div>
        </weapon-attack>
        <v-container>
          <div v-if="hasAux(mount, item)" class="my-3">
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
                ref="aux"
                :item="hasAux(mount, item)"
                :mech="mech"
                :mount="mount"
                aux
                class="mt-n3"
              >
                <div class="heading h3 mt-3 mb-n3">
                  <v-icon large class="mt-n2 mr-n1">cc:mech-weapon</v-icon>
                  {{ hasAux(mount, item).Name }}
                </div>
              </weapon-attack>
            </v-alert>
          </div>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { WeaponSize } from '@/class';

import WeaponAttack from '../../components/_WeaponAttack.vue';

export default {
  name: 'skirmish-dialog',
  components: { WeaponAttack },
  props: {
    item: {
      type: Object,
      required: false,
      default: null,
    },
    mech: {
      type: Object,
      required: true,
    },
    mount: {
      type: Object,
      required: false,
      default: null,
    },
    overwatch: {
      type: Boolean,
    },
  },
  data: () => ({
    dialog: false,
    confirmedFree: false,
  }),
  methods: {
    hasAux(mount, primary) {
      const auxes = mount.Weapons.filter((x) => x.Size === WeaponSize.Aux);
      if (!auxes.length) return false;
      const unusedAux = auxes.filter((x) => x !== primary);
      if (!unusedAux.length) return false;
      const candidate = unusedAux[0];
      if (this.item === candidate) return false;
      return candidate || false;
    },
    confirmAttack(free) {
      this.confirmedFree = free;
      this.$emit('confirm', free);
    },
    reset() {
      this.$refs.main.reset();
      if (this.hasAux && this.$refs.aux) this.$refs.aux.reset();
    },
    init() {
      this.$refs.main.init();
    },
    confirm(): void {
      if (this.confirmedFree) this.reset();
      this.confirmedFree = false;
      this.dialog = false;
      this.$emit('close');
      this.$refs.main.init();
    },
    show(): void {
      this.dialog = true;
    },
    hide(): void {
      if (this.confirmedFree) this.reset();
      this.confirmedFree = false;
      this.dialog = false;
      this.$emit('close');
      this.$refs.main.init();
    },
  },
};
</script>
