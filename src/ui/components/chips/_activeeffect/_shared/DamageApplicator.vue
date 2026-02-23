<template>
  <v-col v-if="event.DamageEvents.length"
    :cols="mobile ? 12 : cols">
    <v-row v-for="(d, d_idx) in event.DamageEvents"
      :key="`damageEvent_${event.ID}_${d_idx}`"
      no-gutters>
      <v-col :cols="mobile ? '' : 'auto'">
        <div class="text-cc-overline text-disabled">damage type</div>
        <v-select :model-value="d.DamageType"
          :items="damageOptions"
          density="compact"
          hide-details
          variant="outlined"
          flat
          tile />
      </v-col>

      <v-col cols="auto"
        class="ml-4">
        <div class="text-cc-overline text-disabled ml-6">damage value</div>

        <v-text-field :model-value="d.DamageRolledValue"
          :placeholder="d.DamageRollString"
          type="number"
          density="compact"
          hide-spin-buttons
          variant="outlined"
          flat
          :hide-details="!damageHints.length"
          persistent-hint
          :hint="damageHints(d)"
          tile
          :error="isNaN(d.DamageRolledValue)"
          width="200px"
          @update:model-value="d.DamageRolledValue = Number($event)">
          <template #prepend>
            <dice-roll-interface :roll-data="d" />
          </template>
        </v-text-field>

        <div v-if=d.Bonus
          class=pt-1>
          <div class="text-cc-overline text-disabled ml-6">Bonus Damage</div>
          <v-text-field v-model="d.BonusDamageValue"
            :placeholder="d.BonusDamageString"
            class=bonusField
            type="number"
            density="compact"
            hide-spin-buttons
            hide-details
            variant="outlined"
            flat
            tile
            width="200">
            <template #prepend>
              <dice-roll-interface :roll-data="d.BonusDamageEvent" />
            </template>
            <template #append>
              <v-tooltip v-if="aoe"
                location="top"
                max-width="250">
                <template #activator="{ props }">
                  <v-icon v-bind="props"
                    class="mr-n4 ml-n2"
                    size="25"
                    icon="mdi-alert-outline" />
                </template>
                <div class="text-center">Bonus Damage will be halved (Area of Effect)</div>
              </v-tooltip>
            </template>
          </v-text-field>
        </div>
        <damage-effect-options :damage-effect="d"
          class="ml-5" />

      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import DiceRollInterface from './DiceRollInterface.vue';
import DamageEffectOptions from './DamageEffectOptions.vue';
import { DamageEvent } from '@/classes/components/feature/active_effects/effect_events/damageEvent';

export default {
  name: 'DamageApplicator',
  components: {
    DiceRollInterface,
    DamageEffectOptions,
  },
  props: {
    event: { type: Object, required: true },
    aoe: { type: Boolean },
    cols: { type: [Number, String], default: 'auto' }
  },
  data: () => ({
    damageOptions: [
      { title: 'Kinetic', value: 'kinetic' },
      { title: 'Energy', value: 'energy' },
      { title: 'Explosive', value: 'explosive' },
      { title: 'Heat', value: 'heat' },
      { title: 'Burn', value: 'burn' },
    ],
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },

  },
  methods: {
    damageHints(d: DamageEvent) {
      const hints = [] as string[];
      if (d.AP) hints.push(`AP`);
      if (d.IsCrit) hints.push(`Critical Hit`);
      if (d.Irreducible) hints.push(`Irreducible`);
      if (d.Overkill) hints.push(`Overkill`);
      if (d.Reliable) hints.push(`Reliable ${d.Reliable}`);

      return hints.join(' // ');
    },
  }
};
</script>
