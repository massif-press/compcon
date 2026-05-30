<template>
  <combat-action-button :action="action"
    :owner="owner"
    :encounter="encounter">
    <template #default="{ close }">
      <v-card color="panel"
        flat
        tile
        class="px-12">
        <cc-synergy-display location="overcharge"
          :mech="controller.Parent"
          alert />
        <div class="text-center text-cc-overline text-disabled my-2">OVERCHARGE cost</div>
        <v-row no-gutters>
          <v-col v-for="(t, n) in controller.OverchargeTrack"
            :key="`overcharge-${n}`"
            class="text-center mx-n4">
            <v-card flat
              color="overcharge"
              class="py-2"
              style="
                corner-shape: bevel;
                border-bottom-left-radius: 60px;
                border-top-left-radius: 0px;
                border-top-right-radius: 60px;
                border-bottom-right-radius: 0px;
              "
              :style="currentOvercharge > n ? 'opacity: 0.4 ' : ''"
              :variant="currentOvercharge >= n ? 'flat' : 'outlined'">
              <div class="heading h3">
                <v-icon>cc:heat</v-icon>
                +{{ t }}
              </div>
            </v-card>
          </v-col>
        </v-row>
        <v-row dense
          class="text-center my-3"
          align="center"
          justify="center">
          <v-col cols="auto">Overcharging will incur</v-col>
          <v-col cols="auto">
            <v-btn icon
              flat
              tile
              color="panel"
              size="x-small"
              class="fade-select ml-2 mr-n2 mt-n1"
              @click="roll()">
              <v-icon icon="mdi-dice-d20"
                size="30" />
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-text-field v-model="heatCost"
              :placeholder="controller.OverchargeCost"
              class="d-inline-block"
              density="compact"
              type="number"
              width="200px"
              hide-details
              flat
              tile
              variant="outlined"
              color="overcharge"
              append-inner-icon="cc:heat" />
          </v-col>
          <v-col cols="auto">Heat</v-col>
        </v-row>
      </v-card>
      <menu-input :key="controller.ID"
        hide-input
        :active-effect="action"
        :encounter="encounter"
        :owner="owner"
        :close="close"
        @apply="apply"
        @reset="reset" />
    </template>
  </combat-action-button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DamageType } from '@/classes/enums';
import { DiceRoller } from '@/classes/dice/DiceRoller';
import CombatActionButton from './CombatActionButton.vue';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

const props = defineProps<{
  action: object
  owner: object
  encounter: object
}>()

const emit = defineEmits<{
  'activate': []
}>()

const heatCost = ref(1)

const controller = computed(() => {
      return props.owner.actor.CombatController.ActiveActor.CombatController;
    })
const currentOvercharge = computed(() => {
      return controller.value.OverchargeLevel;
    })

function roll() {
      heatCost.value = DiceRoller.roll(controller.value.OverchargeCost);
    }
function apply() {
      controller.value.toggleCombatAction('Overcharge');
      controller.value.ResetActivation('quick')
      controller.value.TakeDamage(DamageType.Heat, Number(heatCost.value));
      controller.value.IncreaseOverchargeLevel();
      emit('activate', props.action.ID);
    }
function reset() {
      controller.value.ResetActivation(props.action.Activation);
    }
</script>
