<template>
  <v-card id="systems-container" flat tile color="transparent">
    <fieldset
      class="px-3"
      :class="mobile && 'border-0'"
      style="border-color: rgba(155, 155, 155, 0.6)">
      <legend :style="`color: ${color}`" class="heading h3">Systems</legend>
      <div style="position: relative">
        <div class="side-legend">
          <span
            :class="`heading h3 ${
              mech.FreeSP < 0 ? 'text-error' : 'text-disabled text--darken-3'
            }`">
            <v-icon v-if="mech.FreeSP < 0" color="error" size="small">mdi-alert</v-icon>
            {{ mech.FreeSP }} / {{ mech.MaxSP }}
            <span class="text-cc-overline">SP</span>
          </span>
        </div>
      </div>
      <div style="position: relative; overflow-anchor: none">
        <masonry-wall
          :items="systemItems"
          :column-width="400"
          :gap="16"
          :min-columns="1"
          :max-columns="2">
          <template #default="{ item, index }">
            <component
              :is="item.component"
              :key="item.id"
              :item="item.item"
              :mech="item.props.mech"
              :color="item.props.color"
              :readonly="item.props.readonly"
              :weapon="item.weapon"
              :integrated="item.props.integrated"
              :empty="item.props.empty"
              @selector-open="selector = true"
              @switch="switchSystem($event)" />
          </template>
        </masonry-wall>
      </div>

      <v-row v-if="!readonly && mech.FreeSP <= 0" justify="end" class="mt-1">
        <v-col cols="auto">
          <cc-button
            size="small"
            color="accent"
            variant="tonal"
            prepend-icon="mdi-plus"
            @click.stop="setAddAdditional">
            Add Additional System
          </cc-button>
        </v-col>
      </v-row>

      <cc-solo-modal v-model="selector" icon="cc:system" title="SELECT EQUIPMENT" clip>
        <system-selector :mech="mech" :swap-system="swapSystem" @done="handleDone" />
      </cc-solo-modal>
    </fieldset>
  </v-card>
</template>

<script lang="ts">
import _ from 'lodash';
import SystemSlotCard from './_SystemSlotCard.vue';
import ModEquippedCard from './_ModEquippedCard.vue';
import SystemSelector from './_SystemSelector.vue';

export default {
  name: 'systems-block',
  components: { SystemSlotCard, ModEquippedCard, SystemSelector },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
  },
  data: () => ({
    selector: false,
    swapSystem: null as any,
    additionalSystem: false,
    systemItems: [] as any[],
  }),
  watch: {
    mech: {
      immediate: true,
      deep: true,
      handler() {
        this.updateSystemItems();
      },
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    moddedWeapons() {
      return this.mech.MechLoadoutController.ActiveLoadout.Weapons.filter((x) => x.Mod);
    },
    activeSystems() {
      return this.mech.MechLoadoutController.ActiveLoadout.Systems;
    },
    integratedSystems() {
      return this.mech.MechLoadoutController.ActiveLoadout.IntegratedSystems;
    },
  },
  methods: {
    updateSystemItems() {
      const arr: any[] = [];

      this.integratedSystems.forEach((s) => {
        arr.push({
          component: SystemSlotCard,
          id: s.ID,
          props: {
            mech: this.mech,
            item: s,
            color: this.color,
            readonly: this.readonly,
            integrated: true,
          },
          item: s,
        });
      });

      this.moddedWeapons.forEach((w) => {
        arr.push({
          component: ModEquippedCard,
          id: w.ID,
          props: {
            mech: this.mech,
            color: this.color,
            readonly: this.readonly,
          },
          item: w.Mod,
          weapon: w,
        });
      });

      this.activeSystems.forEach((s) => {
        arr.push({
          component: SystemSlotCard,
          id: s.ID,
          props: {
            mech: this.mech,
            item: s,
            color: this.color,
            readonly: this.readonly,
          },
          item: s,
        });
      });

      if (this.mech.FreeSP && !this.readonly) {
        arr.push({
          component: SystemSlotCard,
          id: 'add-system',
          props: {
            mech: this.mech,
            item: null,
            color: this.color,
            readonly: this.readonly,
            empty: true,
          },
          item: null,
        });
      }

      this.systemItems = arr;
    },
    switchSystem(item: any) {
      this.swapSystem = item;
      this.selector = true;
    },
    setAddAdditional() {
      this.additionalSystem = true;
      this.selector = true;
    },
    async handleDone() {
      this.swapSystem = null;

      this.updateSystemItems(); // triggers list update

      await this.$nextTick(); // wait for DOM to update
      await new Promise((r) => setTimeout(r, 0)); // ensure Vue has flushed

      this.selector = false; // close modal AFTER layout settles
    },
  },
};
</script>

<style scoped>
fieldset {
  border-color: rgb(var(--v-theme-grey-darken2));
  border-radius: 5px;
  margin-bottom: 12px;
  padding: 4px;
}

legend {
  padding: 3px 12px;
}

.side-legend {
  position: absolute;
  right: 20px;
  top: -34px;
  background-color: rgb(var(--v-theme-background));
  padding: 0px 8px;
  height: 28px;
  border: 1px solid grey;
  border-radius: 5px;
}

#masonry-wall-container {
  contain: layout style;
}
</style>
