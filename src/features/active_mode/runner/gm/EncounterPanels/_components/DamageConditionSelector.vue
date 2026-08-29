<template>
  <div>
    <div class="text-cc-overline text-disabled">{{ $t('active.dmgCond.title') }}</div>
    <v-row dense
      justify="center">
      <v-col v-for="damage in damageTypes"
        :key="damage.Name"
        cols="4">
        <v-card flat
          tile
          :color="hasImmunity(damage)
            ? 'exotic'
            : hasVulnerability(damage)
              ? 'error'
              : hasResistance(damage)
                ? 'success'
                : 'panel'
            "
          :style="`position: relative; height: 100%; padding-top: ${layout.padY * 2}px; padding-bottom: ${layout.padY * 2}px; min-height: ${layout.tileHeight}px; border: 2px solid ${hasImmunity(damage) ? 'rgb(var(--v-theme-primary))' : hasVulnerability(damage) ? 'rgba(249, 219, 78, 0.5)' : 'rgb(var(--v-theme-panel))'}`"
          :class="`px-${layout.padX} text-center d-flex flex-column align-center justify-center`">
          <div v-if="layout.showIcon || (layout.showIcon && hasImmunity(damage))"
            class="damage-icon-wrap"
            :style="`min-height: ${layout.tileIconSize + 10}px; min-width: ${layout.tileIconSize + 10}px`">
            <v-icon v-if="immunities.some((r) => r === damage.Name)"
              icon="mdi-cancel"
              color="accent"
              class="damage-immunity-mark"
              :size="layout.tileIconSize + 10" />
            <v-icon v-if="layout.showIcon"
              :icon="damage.icon"
              :size="layout.tileIconSize" />
          </div>
          <div v-if="layout.showLabel"
            class="text-cc-overline damage-label">{{ $t(damage.label) }}</div>
          <div v-if="layout.showLabel && conditionLabel(damage)"
            class="text-caption damage-condition">{{ conditionLabel(damage) }}</div>

          <v-menu activator="parent"
            location="bottom">
            <v-list density="compact"
              :selected="[currentCondition(damage)]"
              @update:selected="setCondition(damage, $event[0])">
              <v-list-item v-for="opt in conditionOptions"
                :key="opt.value"
                :value="opt.value">
                <v-list-item-title class="text-cc-overline">{{ $t(opt.label) }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-tooltip activator="parent"
            :open-delay="400"
            location="top"
            max-width="300">
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
                  ? $t('active.dmgCond.immunity')
                  : hasVulnerability(damage)
                    ? $t('active.dmgCond.vulnerability')
                    : $t('active.dmgCond.resistance')
              }}
            </div>
            {{
              hasImmunity(damage)
                ? $t('active.dmgCond.noDamage')
                : hasResistance(damage)
                  ? $t('active.common.halfDamage')
                  : hasVulnerability(damage)
                    ? $t('active.dmgCond.doubleDamage')
                    : $t('active.dmgCond.fullDamage')
            }}
            {{ $t('active.dmgCond.fromAttacks', { type: damage.Name }) }}
          </v-tooltip>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n';
import * as _ from 'lodash-es';
import { CombatController } from '@/classes/components/combat/CombatController';
import { useLayoutOptions } from '@/features/active_mode/layoutOptions';

const props = defineProps<{
  controller: CombatController;
}>()

const { layout } = useLayoutOptions()
const { t } = useI18n()

const damageTypes = ref([
  {
    ID: 1,
    Name: 'Kinetic',
    label: 'enums.damageType.kinetic',
    icon: 'cc:kinetic',
    color: 'damage--kinetic',
  },
  {
    ID: 2,
    Name: 'Energy',
    label: 'enums.damageType.energy',
    icon: 'cc:energy',
    color: 'damage--energy',
  },
  {
    ID: 3,
    Name: 'Explosive',
    label: 'enums.damageType.explosive',
    icon: 'cc:explosive',
    color: 'damage--explosive',
  },
  { ID: 4, Name: 'Heat', label: 'enums.damageType.heat', icon: 'cc:heat', color: 'damage--heat' },
  { ID: 5, Name: 'Burn', label: 'enums.damageType.burn', icon: 'cc:burn', color: 'damage--burn' },
  { ID: 5, Name: 'AoE', label: 'enums.damageType.aoe', icon: 'cc:blast', color: 'damage--variable' },
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

const conditionOptions = [
  { value: 'normal', label: 'active.dmgCond.normal' },
  { value: 'resistance', label: 'active.dmgCond.resistance' },
  { value: 'vulnerable', label: 'active.dmgCond.vulnerability' },
  { value: 'immunity', label: 'active.dmgCond.immunity' },
];

function currentCondition(resist) {
  if (hasImmunity(resist)) return 'immunity';
  if (hasVulnerability(resist)) return 'vulnerable';
  if (hasResistance(resist)) return 'resistance';
  return 'normal';
}

function setCondition(resist, condition) {
  if (!condition || condition === currentCondition(resist)) return;
  props.controller.SetResistance(
    resist.Name.toLowerCase(),
    condition === 'normal' ? undefined : condition,
    true
  );
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
function conditionLabel(resist) {
  if (hasImmunity(resist)) return t('active.dmgCond.immunity');
  if (hasVulnerability(resist)) return t('active.dmgCond.vulnerability');
  if (hasResistance(resist)) return t('active.dmgCond.resistance');
  return '';
}
</script>

<style scoped>
@import '../encounter-panels.css';

.damage-icon-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.damage-immunity-mark {
  position: absolute;
  inset: 0;
  margin: auto;
}

.damage-label {
  line-height: 1.1;
  text-align: center;
}

.damage-condition {
  line-height: 1.1;
  text-align: center;
  opacity: 0.85;
  text-transform: uppercase;
}
</style>
