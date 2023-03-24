<template>
  <v-menu top>
    <template v-slot:activator="{ props }">
      <div v-if="visible" style="position: relative">
        <div class="side-legend">
          <v-btn small variant="outlined" :color="color" v-bind="props">
            <v-icon :left="!hasEffect">cc:corebonus</v-icon>
            <span v-if="!hasEffect">Core Bonus Available</span>
          </v-btn>
        </div>
      </div>
    </template>
    <v-card variant="outlined" elevation="10">
      <v-card-title
        :style="`background-color: ${color}; height: 32px`"
        class="white--text"
      >
        <div class="mt-n4">
          <v-icon large left dark class="mt-n2">cc:corebonus</v-icon>
          <span class="heading h2">Mount CORE Bonuses</span>
        </div>
      </v-card-title>
      <v-card-text class="text-center">
        <v-row dense class="mt-2 mx-3">
          <v-btn
            v-for="b in mech.AvailableBonuses"
            :key="`${mount.ID}_cb_${b.Name}`"
            block
            color="primary"
            class="my-1"
            tile
            large
            @click="mount.AddCoreBonus(b)"
          >
            Install {{ b.Name }}
          </v-btn>
          <v-btn
            v-for="b in mount.Bonuses"
            :key="`${mount.ID}_cb_${b.Name}`"
            block
            color="secondary"
            class="my-1"
            variant="outlined"
            large
            @click="mount.RemoveCoreBonus(b)"
          >
            Uninstall {{ b.Name }}
          </v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'cb-mount-menu',
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
  computed: {
    hasEffect(): boolean {
      return this.mount.Bonuses.length;
    },
    color(): string {
      return this.mech.Frame.Manufacturer.GetColor(this.$vuetify.theme.dark);
    },
    visible(): boolean {
      return this.mech.AvailableBonuses.length || this.mount.Bonuses.length;
    },
  },
};
</script>

<style scoped>
.side-legend {
  position: absolute;
  right: 20px;
  top: -40px;
  background-color: rgb(var(--v-theme-background));
  height: 30px;
  border: 2px;
  border-color: rgb(var(--v-theme-stark));
  border-radius: 5px;
}
</style>
