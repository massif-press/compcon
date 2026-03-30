<template>
  <v-row dense
    align="start">
    <v-col v-if="pc"
      cols="12"
      sm="auto">
      <local-target-selector :event="event" />
    </v-col>
    <base-target-selector v-else
      :event="event" />

    <base-attack-roller :event="event" />
    <base-save-roller :event="event" />
    <status-applicator :event="event" />
    <damage-applicator :event="event" />
    <other-applicator :event="event" />
    <resistance-applicator :event="event" />
    <special-condition-applicator :event="event" />
    <special-condition-remover :event="event" />
  </v-row>
</template>

<script lang="ts">
import StatusApplicator from './_shared/StatusApplicator.vue';
import BaseAttackRoller from './_shared/BaseAttackRoller.vue';
import BaseSaveRoller from './_shared/BaseSaveRoller.vue';
import BaseTargetSelector from './_shared/BaseTargetSelector.vue';
import DamageApplicator from './_shared/DamageApplicator.vue';
import OtherApplicator from './_shared/OtherApplicator.vue';
import ResistanceApplicator from './_shared/ResistanceApplicator.vue';
import SpecialConditionApplicator from './_shared/SpecialConditionApplicator.vue';
import SpecialConditionRemover from './_shared/SpecialConditionRemover.vue';
import LocalTargetSelector from './_shared/LocalTargetSelector.vue';

export default {
  name: 'EffectApplicator',
  components: {
    BaseAttackRoller,
    BaseSaveRoller,
    BaseTargetSelector,
    DamageApplicator,
    OtherApplicator,
    StatusApplicator,
    ResistanceApplicator,
    SpecialConditionApplicator,
    SpecialConditionRemover,
    LocalTargetSelector,
  },
  props: {
    event: {
      type: Object,
      required: true,
    },
    pc: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown
    }
  }
}
</script>
