<template>
  <v-footer
    fixed
    style="
      padding-bottom: 2px;
      border-top: 2px solid rgb(var(--v-theme-primary));
    "
  >
    <div v-if="pilot && pilot.State">
      <v-slide-y-transition group leave-absolute>
        <narrative-footer
          v-if="pilot.State.Stage === 'Narrative'"
          :key="'a-ftr-narrative'"
        />
        <combat-footer
          v-if="pilot.State.Stage === 'Combat'"
          :key="'a-ftr-combat'"
        />
        <rest-footer v-if="pilot.State.Stage === 'Rest'" :key="'a-ftr-rest'" />
      </v-slide-y-transition>
    </div>
    <v-spacer />
  </v-footer>
</template>

<script lang="ts">
import NarrativeFooter from './footers/NarrativeFooter.vue';
import CombatFooter from './footers/CombatFooter.vue';
import RestFooter from './footers/RestFooter.vue';

export default {
  name: 'turn-footer',
  components: { NarrativeFooter, CombatFooter, RestFooter },
};
</script>
