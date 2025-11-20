<template>
  <v-card class="mb-2" flat tile border>
    <v-toolbar density="compact" height="50" color="primary">
      <span class="heading h3 text-stark px-2">
        {{ cs.Name }}
      </span>
    </v-toolbar>
    <div class="pa-2">
      <v-row no-gutters>
        <v-col cols="auto">
          <v-tooltip
            location="top"
            :text="`Core Power ${mech.CombatController.CorePower ? 'Available' : 'Depleted'}`">
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                :icon="mech.CombatController.CorePower ? 'mdi-battery-high' : 'mdi-battery-outline'"
                :color="mech.CombatController.CorePower ? 'lime' : 'grey'"
                size="large"
                class="mr-1" />
            </template>
          </v-tooltip>
        </v-col>
        <v-col>
          <cc-combat-action-chip
            :action="cs.ActivateAction"
            :owner="mech"
            :encounter="encounterInstance" />
        </v-col>
      </v-row>

      <div v-if="cs.ActiveActions?.length" class="mb-2 mt-1">
        <cc-combat-action-chip
          v-for="a in cs.ActiveActions"
          :action="a"
          :owner="mech"
          :encounter="encounterInstance" />
      </div>

      <div v-if="cs.Deployables?.length" class="mb-2">
        <v-row v-for="d in cs.Deployables" dense align="center">
          <v-col cols="auto">
            <v-tooltip location="top" text="Equipment Deployable (Instance)">
              <template #activator="{ props }">
                <v-icon v-bind="props" size="small" icon="cc:drone" />
              </template>
            </v-tooltip>
          </v-col>
          <v-col>
            <v-row no-gutters align="center">
              <v-col cols="auto">
                <cc-deployable-info :deployable="d" class="mb-1" :name-override="cs.Name" />
              </v-col>
              <v-col>
                <deploy-button :deployable="d" :actor="mech" @deploy="$emit('deploy', d)" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>

      <v-row dense v-if="cs.PassiveName">
        <v-col cols="auto">
          <span class="heading h3 text-accent">
            <v-chip color="primary" flat tile size="small" variant="elevated" class="mr-1">
              PASSIVE
            </v-chip>
            {{ cs.PassiveName || '' }}
          </span>
        </v-col>
      </v-row>
      <div
        v-if="cs.PassiveEffect.length || cs.PassiveActions.length"
        class="light-panel pa-2 clipped mb-2 mx-3">
        <p v-if="cs.PassiveEffect" v-html-safe="cs.PassiveEffect" class="text-text mb-1 px-3" />
        <v-row v-if="cs.PassiveActions.length" dense justify="center">
          <v-col
            v-for="(a, i) in cs.PassiveActions"
            :cols="i + 1 === cs.PassiveActions.length && i % 2 === 0 ? '12' : '6'">
            <cc-action :action="a" :panel="$vuetify.display.lgAndUp" style="height: 100%" />
          </v-col>
        </v-row>
      </div>

      <v-row v-if="cs.Deployables.length" no-gutters justify="center">
        <v-col v-for="(d, i) in cs.Deployables" cols="auto">
          <cc-deployable-info :deployable="d" panel class="ma-2" />
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'mech-core-panel',
  props: {
    mech: {
      type: Object,
      required: true,
    },
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  computed: {
    cs() {
      return this.mech.Frame.CoreSystem;
    },
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
