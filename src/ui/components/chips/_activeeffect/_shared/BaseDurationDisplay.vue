<template>
  <v-card
    v-if="durationText"
    style="width: 100%"
    flat
    tile
    variant="elevated"
    class="mt-1 pa-1"
    color="light-panel">
    <div class="text-text text-caption text-center">
      <span v-if="prefix">{{ prefix }}&nbsp;</span>
      <b>{{ durationText }}</b>
    </div>
  </v-card>
</template>

<script>
import { EffectDurationText } from '@/classes/components/feature/active_effects/EffectDuration';

export default {
  name: 'BaseDurationDisplay',
  props: {
    duration: { type: [String, Object], required: true },
    prefix: { type: String, default: 'Until' },
  },
  computed: {
    durationText() {
      return EffectDurationText(this.duration);
    },
  },
};
</script>
