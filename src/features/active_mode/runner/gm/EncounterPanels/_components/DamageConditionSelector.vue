<template>
  <div>
    <div class="text-cc-overline text-disabled">RESIST / IMMUNE / VULN.</div>
    <v-row dense
      justify="center">
      <v-col v-for="damage in damageTypes"
        :key="damage.Name"
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

<script setup lang="ts">
import { computed, ref } from 'vue'
import * as _ from 'lodash-es';
import { CombatController } from '@/classes/components/combat/CombatController';

const props = defineProps<{
  controller: CombatController;
}>()

const damageTypes = ref([
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
])

const vulnerabilities = computed(() => {
  return props.controller.Resistances.filter((x) => x.condition === 'vulnerable').map(
    (x) => x.type
  );
})
const immunities = computed(() => {
  return props.controller.Resistances.filter((x) => x.condition === 'immunity').map(
    (x) => x.type
  );
})
const resistances = computed(() => {
  return props.controller.Resistances.filter((x) => x.condition === 'resistance').map(
    (x) => x.type
  );
})

function addResistance(resist) {
  let condition;
  const name = resist.Name.toLowerCase();

  if (vulnerabilities.value.includes(name)) {
    condition = undefined;
  } else if (immunities.value.includes(name)) {
    condition = 'vulnerable';
  } else if (resistances.value.includes(name)) {
    condition = 'immunity';
  } else {
    condition = 'resistance';
  }

  props.controller.SetResistance(name, condition, true);
}
function hasResistance(resist) {
  return resistances.value.includes(resist.Name.toLowerCase());
}
function hasImmunity(resist) {
  return immunities.value.includes(resist.Name.toLowerCase());
}
function hasVulnerability(resist) {
  return vulnerabilities.value.includes(resist.Name.toLowerCase());
}
</script>

<style scoped>
@import '../encounter-panels.css';
</style>
