<template>
  <div class="mx-3">
    <span class="heading h2 text--text">{{ coreSystem.Name }}</span>
    <p
      v-show="$vuetify.breakpoint.mdAndUp"
      class="flavor-text px-3"
      v-html="coreSystem.Description"
    />

    <div v-if="coreSystem.PassiveEffect">
      <span class="heading sub">
        PASSIVE {{ coreSystem.PassiveName ? ` - ${coreSystem.PassiveName}` : '' }}
      </span>
      <div class="light-panel pa-2 clipped mb-2 mx-3">
        <p class="body-text mb-1 px-3" v-html-safe="coreSystem.PassiveEffect" />
        <v-row no-gutters justify="center">
          <v-col cols="auto">
            <cc-action
              v-for="(a, i) in coreSystem.PassiveActions"
              :key="`${coreSystem.Name}_action_${i}`"
              :action="a"
              :panel="$vuetify.breakpoint.lgAndUp"
            />
          </v-col>
        </v-row>
        <!-- <cc-bonus v-for="(b, i) in coreSystem.PassiveBonuses" :key="`${coreSystem.Name}_bonus_${i}`" :bonus="b" />
        <cc-synergy
          v-for="(s, i) in coreSystem.PassiveSynergies"
          :key="`${coreSystem.Name}_synergy_${i}`"
          :synergy="s"
        /> -->
      </div>
    </div>

    <v-row no-gutters>
      <v-col cols="auto">
        <span class="heading sub">
          ACTIVE {{ coreSystem.ActiveName ? ` - ${coreSystem.ActiveName}` : '' }}
        </span>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-chip
          v-if="
            coreSystem.Use !== 'Mission' ||
              coreSystem.Duration !== 'Unlimited' ||
              coreSystem.Duration !== 'Mission'
          "
          small
          label
          outlined
        >
          {{ coreSystem.Duration.toUpperCase() }}
        </v-chip>
        <v-chip small label dark :color="`action--${coreSystem.Activation.toLowerCase()}`">
          {{ coreSystem.Activation.toUpperCase() }}
        </v-chip>
      </v-col>
    </v-row>
    <div class="light-panel pa-2 clipped mb-2 mx-3 mt-1">
      <p class="body-text mb-1 px-3" v-html-safe="coreSystem.ActiveEffect" />
      <cc-action
        v-for="(a, i) in coreSystem.ActiveActions"
        :key="`${coreSystem.Name}_action_${i}`"
        :action="a"
        :panel="$vuetify.breakpoint.lgAndUp"
        class="ma-2"
      />
      <!-- <cc-bonus
        v-for="(b, i) in coreSystem.ActiveBonuses"
        :key="`${coreSystem.Name}_bonus_${i}`"
        :bonus="b"
        :panel="$vuetify.breakpoint.lgAndUp"
      />
      <cc-synergy
        v-for="(s, i) in coreSystem.ActiveSynergies"
        :key="`${coreSystem.Name}_synergy_${i}`"
        :synergy="s"
        :panel="$vuetify.breakpoint.lgAndUp"
      /> -->
    </div>

    <!-- <span
      v-if="coreSystem.IntegratedEquipment.length || coreSystem.Deployables.length"
      class="heading sub"
    >
      CORE INTEGRATED EQUIPMENT
    </span>
    <v-row v-if="coreSystem.IntegratedEquipment.length" no-gutters justify="center">
      <v-col
        v-for="(x, i) in coreSystem.IntegratedEquipment"
        :key="`${coreSystem.Name}_integrated_${i}`"
        cols="auto"
      >
        <cc-integrated-info :item="x" :panel="$vuetify.breakpoint.lgAndUp" />
      </v-col>
    </v-row> -->

    <v-row v-if="coreSystem.Deployables.length" no-gutters justify="center">
      <v-col
        v-for="(d, i) in coreSystem.Deployables"
        :key="`${coreSystem.Name}_deployable_${i}`"
        cols="auto"
      >
        <cc-deployable-info :deployable="d" :panel="$vuetify.breakpoint.lgAndUp" class="ma-2" />
      </v-col>
    </v-row>

    <cc-tags :tags="coreSystem.Tags" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'core-item',
  props: {
    coreSystem: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
})
</script>
