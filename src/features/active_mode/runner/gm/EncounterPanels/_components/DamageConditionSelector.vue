<template>
  <div>
    <div class="text-cc-overline text-disabled">RESIST / IMMUNE / VULNERABLE</div>
    <v-row dense justify="center">
      <v-col v-for="damage in damageTypes" cols="4">
        <v-tooltip :open-delay="400" location="top" max-width="300">
          <template #activator="{ props }">
            <v-card
              v-bind="props"
              style="position: relative; padding-top: 2px; padding-bottom: 2px"
              flat
              tile
              :color="
                hasVulnerability(damage) ? 'error' : hasResistance(damage) ? 'success' : 'panel'
              "
              :style="`border: 2px solid ${hasImmunity(damage) ? 'rgb(var(--v-theme-primary))' : hasVulnerability(damage) ? 'rgba(249, 219, 78, 0.5)' : 'rgb(var(--v-theme-panel))'}`"
              class="px-2 text-center"
              @click="addResistance(damage)">
              <v-icon
                v-if="immunities.some((r) => r === damage.Name)"
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
              <v-icon :icon="damage.icon" size="35" />
            </v-card>
          </template>
          <div
            v-if="hasResistance(damage) || hasImmunity(damage) || hasVulnerability(damage)"
            class="heading h3"
            :class="
              hasImmunity(damage)
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

    <v-card
      v-for="cds in controller.CustomDamageStatuses"
      :key="cds.type"
      class="mt-1 px-1"
      flat
      tile
      :color="
        cds.condition === 'immune'
          ? 'exotic'
          : cds.condition === 'resistant'
            ? 'success'
            : cds.condition === 'vulnerable'
              ? 'error'
              : ''
      ">
      <v-row dense align="center" class="pl-1">
        <v-col class="text-cc-overline">
          <div>
            <b>{{ cds.type }}</b>
          </div>
          <div class="text-disabled">
            <cc-slashes />
            {{ cds.condition }}
          </div>
        </v-col>
        <v-col></v-col>
        <v-col cols="auto">
          <v-btn
            icon
            variant="text"
            flat
            tile
            size="x-small"
            @click="
              controller.CustomDamageStatuses = controller.CustomDamageStatuses.filter(
                (x) => x !== cds
              )
            ">
            <v-icon size="x-large" icon="mdi-close" />
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <div>
      <v-menu :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            size="x-small"
            color="accent"
            class="mt-1"
            flat
            tile
            block
            variant="text"
            prepend-icon="mdi-plus">
            Add Custom
          </v-btn>
        </template>
        <v-card border tile>
          <v-card-text>
            <v-text-field
              v-model="customStatus"
              label="Condition"
              variant="outlined"
              density="compact"
              clearable
              tile
              hide-details />
            <v-row dense class="mt-1">
              <v-col>
                <v-btn
                  :disabled="!customStatus"
                  :color="!customStatus ? '' : 'error'"
                  flat
                  tile
                  block
                  size="small"
                  @click="addCustom('vulnerable')">
                  Add Vulnerability
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  :disabled="!customStatus"
                  :color="!customStatus ? '' : 'success'"
                  flat
                  tile
                  block
                  size="small"
                  @click="addCustom('resistant')">
                  Add Resistance
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  :disabled="!customStatus"
                  :color="!customStatus ? '' : 'exotic'"
                  flat
                  tile
                  block
                  size="small"
                  @click="addCustom('immune')">
                  Add Immunity
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
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
      return this.controller.DamageStatuses.filter((x) => x.condition === 'vulnerable').map(
        (x) => x.type
      );
    },
    immunities() {
      return this.controller.DamageStatuses.filter((x) => x.condition === 'immune').map(
        (x) => x.type
      );
    },
    resistances() {
      return this.controller.DamageStatuses.filter((x) => x.condition === 'resistant').map(
        (x) => x.type
      );
    },
  },
  methods: {
    addResistance(resist) {
      let condition;
      if (this.vulnerabilities.includes(resist.Name)) {
        condition = undefined;
      } else if (this.immunities.includes(resist.Name)) {
        condition = 'vulnerable';
      } else if (this.resistances.includes(resist.Name)) {
        condition = 'immune';
      } else {
        condition = 'resistant';
      }

      this.controller.SetDamageStatus(resist.Name, condition);
    },
    hasResistance(resist) {
      return this.resistances.includes(resist.Name);
    },
    hasImmunity(resist) {
      return this.immunities.includes(resist.Name);
    },
    hasVulnerability(resist) {
      return this.vulnerabilities.includes(resist.Name);
    },
    addCustom(condition) {
      if (!this.customStatus) return;

      this.controller.CustomDamageStatuses.push({
        type: this.customStatus,
        condition: condition,
      });

      this.customStatus = '';
    },
  },
};
</script>

<style scoped>
.bg-stripes {
  background: repeating-linear-gradient(
    -45deg,
    rgba(249, 219, 78, 0.5),
    rgba(249, 219, 78, 0.5) 10px,
    rgba(100, 100, 100, 0.5) 10px,
    rgba(100, 100, 100, 0.5) 20px
  );
}
</style>
