<template>
  <div class="mt-5">
    <section-header :title="`${mech.Frame.Source} ${mech.Frame.Name} Core System`" />

    <div class="ma-2">
      <span class="heading h2 text-text">{{ coreSystem.Name }}</span>
      <p class="flavor-text px-3" v-html="coreSystem.Description" />

      <div v-if="coreSystem.PassiveName">
        <span class="heading sub">
          <v-chip size="large" class="heading" label>PASSIVE</v-chip>
          {{ coreSystem.PassiveName }}
        </span>
        <div class="light-panel pa-2 clipped mb-2 mx-3">
          <p
            v-if="coreSystem.PassiveEffect"
            v-html-safe="coreSystem.PassiveEffect"
            class="body-text mb-1 px-3"
          />
          <v-row no-gutters justify="center">
            <v-col cols="auto">
              <cc-action v-for="a in coreSystem.PassiveActions" :action="a" panel />
            </v-col>
          </v-row>
        </div>
      </div>

      <v-row no-gutters>
        <v-col cols="auto">
          <span class="heading sub">
            <v-chip size="large" class="heading" label>ACTIVE</v-chip>
            {{ coreSystem.ActiveName }}
          </span>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-chip small label dark :color="`action--${coreSystem.Activation.toLowerCase()}`">
            {{ coreSystem.Activation.toUpperCase() }}
          </v-chip>
        </v-col>
      </v-row>

      <div class="pa-2">
        <p v-html-safe="coreSystem.ActiveEffect" class="body-text mb-1 px-3" />
        <cc-action v-for="a in coreSystem.ActiveActions" :action="a" panel class="ma-2" />
      </div>

      <v-row v-if="coreSystem.Deployables.length" no-gutters justify="center">
        <v-col v-for="d in coreSystem.Deployables" cols="auto">
          <cc-deployable-info :deployable="d" :panel="$vuetify.display.lgAndUp" class="ma-2" />
        </v-col>
      </v-row>

      <cc-tags :tags="coreSystem.Tags" />
    </div>
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../components/SectionHeader.vue';

export default {
  name: 'license-requirements-block',
  components: { SectionHeader },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  computed: {
    coreSystem() {
      return this.mech.Frame.CoreSystem;
    },
  },
};
</script>
