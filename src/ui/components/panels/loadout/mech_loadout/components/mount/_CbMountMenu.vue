<template>
  <v-menu top>
    <template #activator="{ props }">
      <div v-if="visible" style="position: relative">
        <div class="side-legend">
          <v-btn
            size="small"
            variant="outlined"
            class="bg-background"
            prepend-icon="cc:corebonus"
            v-bind="props"
          >
            <span v-if="!hasEffect">Core Bonus Available</span>
          </v-btn>
        </div>
      </div>
    </template>
    <v-card>
      <v-toolbar class="px-2" :color="color">
        <v-icon size="large" start icon="cc:corebonus" />
        <span class="heading h2">Mount CORE Bonuses</span>
      </v-toolbar>
      <v-card-text class="text-center">
        <v-row dense>
          <v-btn
            v-for="b in mech.AvailableBonuses"
            block
            variant="tonal"
            color="accent"
            class="my-1"
            size="large"
            @click="mount.AddCoreBonus(b)"
          >
            Install {{ b.Name }}
          </v-btn>
          <v-btn
            v-for="b in mount.Bonuses"
            block
            color="secondary"
            class="my-1"
            variant="outlined"
            size="large"
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
      return this.mech.Frame.Manufacturer.GetColor(this.$vuetify.theme.current.dark);
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
  top: -24px;
  background-color: rgb(var(--v-theme-background));
  height: 30px;
  border: 2px;
  border-color: rgb(var(--v-theme-stark));
  border-radius: 5px;
}
</style>
