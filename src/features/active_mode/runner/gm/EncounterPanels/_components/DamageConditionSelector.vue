<template>
  <div>
    <div class="text-cc-overline text-disabled">RESIST / IMMUNE / VULN.</div>
    <v-row dense
      justify="center">
      <v-col v-for="damage in damageTypes"
        cols="4">
        <v-tooltip :open-delay="400"
          location="top"
          max-width="300">
          <template #activator="{ props }">
            <v-card v-bind="props"
              style="position: relative; padding-top: 2px; padding-bottom: 2px"
              flat
              tile
              :color="hasVulnerability(damage) ? 'error' : hasResistance(damage) ? 'success' : 'panel'
                "
              :style="`border: 2px solid ${hasImmunity(damage) ? 'rgb(var(--v-theme-primary))' : hasVulnerability(damage) ? 'rgba(249, 219, 78, 0.5)' : 'rgb(var(--v-theme-panel))'}`"
              class="px-2 text-center"
              @click="addResistance(damage)">
              <v-icon v-if="immunities.some((r) => r === damage.Name)"
                icon="mdi-cancel"
                color="accent"
                size="45"
                style="
                  position: absolute;
                  top: 0;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  width: 100%;
                  height: 100%;
                " />
              <v-icon :icon="damage.icon"
                size="35" />
            </v-card>
          </template>
          <div v-if="hasResistance(damage) || hasImmunity(damage) || hasVulnerability(damage)"
            class="heading h3"
            :class="hasImmunity(damage)
                ? 'text-exotic'
                : hasVulnerability(damage)
                  ? 'text-error'
                  : 'text-accent'
              ">
            {{ damage.Name }}
            {{
              hasImmunity(damage)
                ? 'Immunity'
                : hasVulnerability(damage)
                  ? 'Vulnerability'
                  : 'Resistance'
            }}
          </div>
          {{
            hasImmunity(damage)
              ? 'No damage'
              : hasResistance(damage)
                ? 'Half damage'
                : hasVulnerability(damage)
                  ? 'Double damage'
                  : 'Full Damage'
          }}
          from {{ damage.Name }} attacks.
        </v-tooltip>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import _ from 'lodash';
import { CompendiumStore } from '@/stores';

export default {
  name: 'DamageConditionSelector',
  props: {
    controller: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    damageTypes: [
      { ID: 1, Name: 'Kinetic', icon: 'cc:kinetic', color: 'damage--kinetic' },
      { ID: 2, Name: 'Energy', icon: 'cc:energy', color: 'damage--energy' },
      {
        ID: 3,
        Name: 'Explosive',
        icon: 'cc:explosive',
        color: 'damage--explosive',
      },
      { ID: 4, Name: 'Heat', icon: 'cc:heat', color: 'damage--heat' },
      { ID: 5, Name: 'Burn', icon: 'cc:burn', color: 'damage--burn' },
      { ID: 5, Name: 'AoE', icon: 'cc:blast', color: 'damage--variable' },
    ],
    customStatus: '',
  }),
  computed: {
    vulnerabilities() {
      return this.controller.Resistances.filter((x) => x.condition === 'vulnerability').map(
        (x) => x.type
      );
    },
    immunities() {
      return this.controller.Resistances.filter((x) => x.condition === 'immunity').map(
        (x) => x.type
      );
    },
    resistances() {
      return this.controller.Resistances.filter((x) => x.condition === 'resistance').map(
        (x) => x.type
      );
    },
  },
  methods: {
    addResistance(resist) {
      let condition;
      const name = resist.Name.toLowerCase();

      if (this.vulnerabilities.includes(name)) {
        condition = undefined;
      } else if (this.immunities.includes(name)) {
        condition = 'vulnerability';
      } else if (this.resistances.includes(name)) {
        condition = 'immunity';
      } else {
        condition = 'resistance';
      }

      this.controller.SetResistance(name, condition);
    },
    hasResistance(resist) {
      return this.resistances.includes(resist.Name.toLowerCase());
    },
    hasImmunity(resist) {
      return this.immunities.includes(resist.Name.toLowerCase());
    },
    hasVulnerability(resist) {
      return this.vulnerabilities.includes(resist.Name.toLowerCase());
    },
  },
};
</script>

<style scoped>
.bg-stripes {
  background: repeating-linear-gradient(-45deg,
      rgba(249, 219, 78, 0.5),
      rgba(249, 219, 78, 0.5) 10px,
      rgba(100, 100, 100, 0.5) 10px,
      rgba(100, 100, 100, 0.5) 20px);
}
</style>
