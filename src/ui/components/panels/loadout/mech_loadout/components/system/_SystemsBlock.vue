<template>
  <v-card id="container" flat tile color="transparent">
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

      <masonry-wall
        :items="systemItems"
        :column-width="400"
        :gap="16"
        :min-columns="1"
        :max-columns="2"
        :scroll-container="scrollContainer">
        <template #default="{ item }">
          <component
            :is="item.component"
            :item="item.item"
            :mech="item.props.mech"
            :color="item.props.color"
            :readonly="item.props.readonly"
            :weapon="item.weapon"
            :integrated="item.props.integrated"
            :empty="item.props.empty"
            @done="getSystemItems()" />
        </template>
      </masonry-wall>

      <v-row v-if="mech.FreeSP <= 0" justify="end" class="mt-1">
        <v-col cols="auto">
          <cc-button
            size="small"
            color="accent"
            variant="tonal"
            prepend-icon="mdi-plus"
            @click.stop="additionalSelect = true">
            Add Additional System
          </cc-button>
          <cc-solo-modal v-model="additionalSelect" icon="cc:system" title="SELECT EQUIPMENT" clip>
            <system-selector :mech="mech" @equip="getSystemItems()" />
          </cc-solo-modal>
        </v-col>
      </v-row>
    </fieldset>
  </v-card>
</template>

<script lang="ts">
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
    systemItems: [] as { component: any; props: any; item: any; weapon?: any; empty?: boolean }[],
    additionalSelect: false,
    scrollContainer: null as HTMLElement | null,
  }),
  mounted() {
    this.getSystemItems();
    this.scrollContainer = document.querySelector('#container');
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
  watch: {
    moddedWeapons: {
      deep: true,
      handler() {
        this.getSystemItems();
      },
    },
    integratedSystems: {
      deep: true,
      handler() {
        this.getSystemItems();
      },
    },
  },
  methods: {
    getSystemItems() {
      this.systemItems = [];
      this.integratedSystems.forEach((s) => {
        this.systemItems.push({
          component: SystemSlotCard,
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
        this.systemItems.push({
          component: ModEquippedCard,
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
        this.systemItems.push({
          component: SystemSlotCard,
          props: { mech: this.mech, item: s, color: this.color, readonly: this.readonly },
          item: s,
        });
      });
      if (this.mech.FreeSP > 0 && !this.readonly) {
        this.systemItems.push({
          component: SystemSlotCard,
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
</style>
