<template>
  <v-row dense>
    <v-col>
      <!-- targets -->
      <base-target-selector :event="event" />
    </v-col>
    <v-col cols="auto">
      <!-- rollers -->
      <base-attack-roller :event="event" />
      <base-save-roller :event="event" />
    </v-col>
    <v-col cols="auto">
      <!-- applicators -->
      <status-applicator :event="event" />
      <damage-applicator :event="event" />
      <other-applicator :event=event />
      <resistance-applicator :event="event" />
      <special-condition-applicator :event="event" />
      <special-condition-remover :event="event" />
    </v-col>

  </v-row>
</template>

<script lang="ts">
import StatusApplicator from './_shared/StatusApplicator.vue';
import BaseAttackRoller from './_shared/BaseAttackRoller.vue';
import BaseSaveRoller from './_shared/BaseSaveRoller.vue';
import BaseTargetSelector from './_shared/BaseTargetSelector.vue';
import DamageApplicator from './_shared/DamageApplicator.vue';
import OtherApplicator from './_shared/OtherApplicator.vue';
import SaveHalfToggle from './_shared/SaveHalfToggle.vue';
import SaveRollInterface from './_shared/SaveRollInterface.vue';
import ResistanceApplicator from './_shared/ResistanceApplicator.vue';
import SpecialConditionApplicator from './_shared/SpecialConditionApplicator.vue';
import SpecialConditionRemover from './_shared/SpecialConditionRemover.vue';

export default {
  name: 'effect-applicator',
  components: {
    BaseAttackRoller,
    BaseSaveRoller,
    BaseTargetSelector,
    DamageApplicator,
    OtherApplicator,
    SaveHalfToggle,
    SaveRollInterface,
    StatusApplicator,
    ResistanceApplicator,
    SpecialConditionApplicator,
    SpecialConditionRemover
  },
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
}
</script>
