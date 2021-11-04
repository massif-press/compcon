<template>
  <div class="mx-3">
    <span class="heading h2 text--text">{{ coreSystem.Name }}</span>
    <p
      v-show="$vuetify.breakpoint.mdAndUp"
      class="flavor-text px-3"
      v-html="coreSystem.Description"
    />

    <div v-if="coreSystem.PassiveName">
      <span class="heading sub">
        PASSIVE {{ coreSystem.PassiveName ? ` - ${coreSystem.PassiveName}` : '' }}
      </span>
      <div class="light-panel pa-2 clipped mb-2 mx-3">
        <p
          v-if="coreSystem.PassiveEffect"
          v-html-safe="coreSystem.PassiveEffect"
          class="body-text mb-1 px-3"
        />
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
      </div>
    </div>

    <v-row no-gutters>
      <v-col cols="auto">
        <span class="heading sub">
          ACTIVE {{ coreSystem.ActiveName ? ` - ${coreSystem.ActiveName}` : '' }}
        </span>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <!-- <v-chip
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
        </v-chip> -->
        <v-chip small label dark :color="`action--${coreSystem.Activation.toLowerCase()}`">
          {{ coreSystem.Activation.toUpperCase() }}
        </v-chip>
      </v-col>
    </v-row>
    <div class="light-panel pa-2 clipped mb-2 mx-3 mt-1">
      <p v-html-safe="coreSystem.ActiveEffect" class="body-text mb-1 px-3" />
      <cc-action
        v-for="(a, i) in coreSystem.ActiveActions"
        :key="`${coreSystem.Name}_action_${i}`"
        :action="a"
        :panel="$vuetify.breakpoint.lgAndUp"
        class="ma-2"
      />
    </div>

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
