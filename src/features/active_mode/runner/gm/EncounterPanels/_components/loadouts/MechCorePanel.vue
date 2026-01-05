<template>
  <v-card class="mb-2" flat tile border>
    <v-toolbar density="compact" height="50" :color="active ? 'core' : 'panel'">
      <span class="heading h3 px-2">
        {{ cs.Name }}
        <v-chip
          v-if="active"
          color="primary"
          flat
          tile
          size="small"
          class="ml-4 mt-n1"
          variant="flat">
          CORE ACTIVE
        </v-chip>
      </span>
      <v-spacer />
      <v-btn
        icon
        flat
        tile
        variant="outlined"
        size="x-small"
        class="mr-2 fade-select"
        :color="mech.CombatController.CoreActive ? 'background' : 'core'"
        @click="mech.CombatController.CoreActive = !mech.CombatController.CoreActive">
        <v-icon icon="mdi-battery" size="20" />
      </v-btn>
    </v-toolbar>
    <div class="pa-2">
      <v-row no-gutters>
        <v-col>
          <cc-combat-action-chip
            :action="cs.ActivateAction"
            :owner="mech"
            :encounter="encounterInstance"
            :disabled="!mech.CombatController.CorePower"
            custom-disabled-text="Core Power Depleted"
            @activate="mech.CombatController.SetCore(true, encounterInstance.CurrentRound)"
            @reset="mech.CombatController.CoreActive = false">
            <template #icon>
              <v-tooltip
                location="top"
                :text="`Core Power ${mech.CombatController.CorePower ? 'Available' : 'Depleted'}`">
                <template #activator="{ props }">
                  <v-icon
                    v-bind="props"
                    :icon="
                      mech.CombatController.CorePower ? 'mdi-battery-high' : 'mdi-battery-outline'
                    "
                    :color="mech.CombatController.CorePower ? 'core' : 'grey'"
                    size="large"
                    class="mr-1" />
                </template>
              </v-tooltip>
            </template>
          </cc-combat-action-chip>
        </v-col>
      </v-row>

      <v-scroll-y-transition>
        <div v-if="active && cs.ActiveActions?.length" class="mb-2 mt-1">
          <cc-combat-action-chip
            v-for="a in cs.ActiveActions"
            :action="a"
            :owner="mech"
            :encounter="encounterInstance" />
        </div>
      </v-scroll-y-transition>

      <div v-if="cs.Deployables?.length" class="mb-2">
        <deploy-button
          v-for="d in cs.Deployables"
          :deployable="d"
          :actor="mech"
          @deploy="$emit('deploy', d)" />
      </div>

      <v-expansion-panels v-if="cs.PassiveName" flat class="mt-2">
        <v-expansion-panel color="panel" max-height="20px" height="20px" class="pa-0">
          <v-expansion-panel-title>
            <div class="heading h3 text-accent" style="line-height: 0">
              {{ cs.PassiveName || '' }}
              <v-chip color="primary" flat tile size="small" class="ml-4" variant="flat">
                PASSIVE
              </v-chip>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-if="cs.PassiveEffect" class="mb-2 text-text" v-html-safe="cs.PassiveEffect" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <div v-if="cs.PassiveActions?.length" class="mb-2 mt-1">
        <cc-combat-action-chip
          v-for="a in cs.PassiveActions"
          :action="a"
          :owner="mech"
          :encounter="encounterInstance" />
      </div>
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
    active() {
      return this.mech.CombatController.CoreActive;
    },
  },
};
</script>
