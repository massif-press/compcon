<template>
  <div>
    <!-- {{ cs }} -->
    <span class="heading h2 text--text">{{ cs.Name }}</span>
    <p class="flavor-text px-3" v-html-safe="cs.Description" />

    <div v-if="cs.PassiveName">
      <span class="heading sub">PASSIVE {{ cs.PassiveName ? ` - ${cs.PassiveName}` : '' }}</span>
      <div class="light-panel pa-2 clipped mb-2 mx-3">
        <p v-if="cs.PassiveEffect" class="body-text mb-1 px-3" v-html-safe="cs.PassiveEffect" />
        <v-row no-gutters justify="center">
          <v-col cols="auto">
            <cc-action
              v-for="(a, i) in cs.PassiveActions"
              :key="`${cs.Name}_action_${i}`"
              :action="a"
              :panel="$vuetify.breakpoint.lgAndUp"
            />
          </v-col>
        </v-row>
      </div>
    </div>

    <v-row no-gutters>
      <v-col cols="auto">
        <span class="heading sub">ACTIVE {{ cs.ActiveName ? ` - ${cs.ActiveName}` : '' }}</span>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <!-- <v-chip
          v-if="
            cs.Duration !== 'Mission' || cs.Duration !== 'Unlimited' || cs.Duration !== 'Mission'
          "
          small
          label
          outlined
        >
          {{ cs.Duration.toUpperCase() }}
        </v-chip> -->
        <v-chip small label dark :color="`action--${cs.Activation.toLowerCase()}`">
          {{ cs.Activation.toUpperCase() }}
        </v-chip>
      </v-col>
    </v-row>
    <div class="light-panel pa-2 clipped mb-2 mx-3 mt-1">
      <p class="body-text mb-1 px-3" v-html-safe="cs.ActiveEffect" />
      <cc-action
        v-for="(a, i) in cs.ActiveActions"
        :key="`${cs.Name}_action_${i}`"
        :action="a"
        :panel="$vuetify.breakpoint.lgAndUp"
        class="ma-2"
      />
    </div>

    <span v-if="cs.IntegratedEquipment.length || cs.Deployables.length" class="heading sub">
      CORE INTEGRATED EQUIPMENT
    </span>
    <v-row v-if="cs.IntegratedEquipment.length" no-gutters justify="center">
      <v-col
        v-for="(x, i) in cs.IntegratedEquipment"
        :key="`${cs.Name}_integrated_${i}`"
        cols="auto"
      >
        <cc-integrated-info :item="x" :panel="$vuetify.breakpoint.lgAndUp" />
      </v-col>
    </v-row>

    <v-row v-if="cs.Deployables.length" no-gutters justify="center">
      <v-col v-for="(d, i) in cs.Deployables" :key="`${cs.Name}_deployable_${i}`" cols="auto">
        <cc-deployable-info :deployable="d" :panel="$vuetify.breakpoint.lgAndUp" class="ma-2" />
      </v-col>
    </v-row>

    <cc-tags :tags="cs.Tags" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'frame-core-system-panel',
  props: {
    cs: {
      type: Object,
      required: true,
    },
  },
})
</script>
