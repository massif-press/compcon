<template>

  <v-menu open-on-hover
    max-width="400"
    :close-on-content-click="false">
    <template #activator="{ props }">
      <div class="mr-n4 ml-n2">
        <v-btn icon
          size="x-small"
          variant="text"
          flat
          tile
          v-bind="props"
          @click="rollDamage()">
          <v-icon size="25"
            icon="mdi-dice-multiple" />
        </v-btn>
      </div>
    </template>
    <template #default="{ isActive }">
      <v-card class="text-center text-text text-cc-overline"
        style="overflow-x: hidden;"
        border>
        <v-card-text class="pa-2">
          <div class="mb-2">
            <v-chip v-if="rollData.Reliable"
              size="x-small"
              class="ml-1"
              text-color="white">
              {{ $t('ui.combat.reliableN', { n: rollData.Reliable }) }}
            </v-chip>
          </div>
          <v-row>
            <v-col>
              <v-text-field v-model="count"
                density="compact"
                variant="outlined"
                type="number"
                hide-spin-buttons
                flat
                hide-details
                tile />
            </v-col>
            <v-col cols="auto"
              align-self="center"
              class="heading h3 mx-n3">{{ $t('ui.combat.diceD') }}</v-col>
            <v-col>
              <v-select v-model="die"
                :items="dice"
                density="compact"
                variant="outlined"
                type="number"
                flat
                min-width="100"
                hide-details
                tile />
            </v-col>
            <v-col cols="auto"
              align-self="center"
              class="heading h3 mx-n3">+</v-col>
            <v-col>
              <v-text-field v-model="plus"
                density="compact"
                variant="outlined"
                type="number"
                hide-spin-buttons
                flat
                hide-details
                tile />
            </v-col>
          </v-row>
          <v-btn size="x-small"
            flat
            tile
            block
            color="panel"
            class="mt-1"
            @click="reset()">{{ $t('common.reset') }}</v-btn>

          <v-btn flat
            tile
            class="mt-2"
            color="primary"
            size="small"
            block
            @click="rollDamage()">
            {{ $t('common.roll_verb') }}
          </v-btn>
          <div class="pa-2 text-left text-cc-overline text-accent"><span class="text-lowercase">{{ $t('active.skillCheck.rollResults') }}</span></div>
          <div v-if="rollData.DamageRollResult"
            class="text-text">
            <span v-html-safe="rollData.DamageRollResult.toString()" />
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DiceRoller } from '@/classes/dice/DiceRoller'

const props = defineProps<{
  rollData: object
}>()

const emit = defineEmits<{
  'roll-damage': []
  'update:damage-value': [...args: any[]]
}>()

const dice = [2, 3, 4, 6, 8, 10, 12, 20, 100]

const parts = computed(() => {
  if (!props.rollData.DamageRollString.includes('d')) return [];
  return props.rollData.DamageRollString.split('d');
})

const count = computed({
  get() {
    if (parts.value.length === 0) return 0;
    return parts.value[0] ? parseInt(parts.value[0]) : 1;
  },
  set(val: number) {
    props.rollData.DamageRollString = `${val}d${die.value || 6}+${plus.value}`;
  },
})

const die = computed({
  get() {
    if (parts.value.length === 0) return 0;
    const diePart = parts.value[1];
    const plusParts = diePart.split('+');
    return parseInt(plusParts[0]);
  },
  set(val: number) {
    props.rollData.DamageRollString = `${count.value || 1}d${val}+${plus.value}`;
  },
})

const plus = computed({
  get() {
    if (parts.value.length === 0) {
      return Number(props.rollData.DamageRollString || 0);
    }
    const diePart = parts.value[1];
    const plusParts = diePart.split('+');
    if (plusParts.length === 2) {
      return parseInt(plusParts[1]);
    }
    return 0;
  },
  set(val: number) {
    if (parts.value.length === 0) {
      props.rollData.DamageRollString = String(val);
    } else {
      props.rollData.DamageRollString = `${count.value}d${die.value}+${val}`;
    }
  },
})

function rollDamage() {
  const diceValue = count.value && die.value ? `${count.value}d${die.value}+${plus.value || 0}` : 0;
  let rollResult: any;
  try {
    rollResult = DiceRoller.rollDamage(
      diceValue,
      props.rollData.IsCrit,
      props.rollData.Overkill,
      props.rollData.Reliable,
    );
  } catch {
    rollResult = { total: Number(plus.value), toString: () => plus.value.toString() };
  }
  props.rollData.DamageRollResult = rollResult;
  props.rollData.DamageRolledValue = rollResult.total;
  props.rollData.OverkillHeat = rollResult._overkillRerolls;
}
</script>
