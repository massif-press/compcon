<template>
  <v-row dense
    align="end"
    class="pb-2 mt-n2">
    <v-col cols="auto">
      <div class="text-cc-overline text-disabled">// {{ $t('compendium.categories.npcFeatures') }}
      </div>
    </v-col>
    <v-col cols="auto">
      <v-tooltip location="top"
        :text="`${hidePassives ? 'Hiding' : 'Showing'} passive features`">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            size="12"
            flat
            tile
            icon
            @click="hidePassives = !hidePassives">
            <v-icon :color="hidePassives ? 'primary' : 'text'"
              size="18"
              :icon="hidePassives ? 'mdi-eye-off' : 'mdi-eye'" />
          </v-btn>
          <v-chip size="x-small"
            class="pa-2 ml-2 mb-n2"
            flat
            style="opacity: 0.75">
            {{ hiddenFeatureCount }} {{ $t('active.unitLoadout.hiddenFeatures') }}
          </v-chip>
        </template>
      </v-tooltip>
    </v-col>
    <v-spacer />
    <v-col cols="auto">
      <v-menu location="top"
        :close-on-content-click="false"
        width="400">
        <template #activator="{ props: activatorProps }">
          <cc-button color="primary"
            class="mt-4"
            prepend-icon="mdi-reload"
            @click="activatorProps.onClick($event)">
            {{ $t('active.unitLoadout.rollRecharge') }}
          </cc-button>
        </template>
        <template #default="{ isActive }">
          <v-card border>
            <v-card-text>
              <div class="text-cc-overline mb-2">{{ $t('active.unitLoadout.rechargeResult') }}</div>
              <div v-if="result > 0"
                class="text-center my-2">
                <div class="heading h1">{{ result }}</div>
                <div class="text-cc-overline mt-1">
                  {{ $t('active.unitLoadout.rechargesFeatures') }}:
                  <div v-if="rechargedFeatures.length === 0"
                    class="my-1">
                    <i class="text-disabled">{{ $t('common.none') }}</i>
                  </div>
                  <div v-for="feature in rechargedFeatures"
                    :key="feature.ID">
                    <div v-if="result >= feature.Recharge && feature.Used"
                      class="my-1 text-text body-text bg-panel rounded pa-1">
                      {{ feature.Name }}
                      <div class="text-disabled text-cc-overline">
                        {{ $t('active.unitLoadout.rechargesOn', { n: feature.Recharge }) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else
                class="text-center mb-2">
                <i class="text-disabled">{{ $t('active.unitLoadout.clickToRoll') }}</i>
              </div>
              <v-row>
                <v-col>
                  <v-btn flat
                    size="small"
                    tile
                    block
                    :color="result ? 'panel' : 'primary'"
                    @click="roll">
                    {{ result ? $t('active.unitLoadout.reroll') : $t('common.roll_verb') }}
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn flat
                    size="small"
                    tile
                    block
                    :disabled="result === 0"
                    :color="result ? 'primary' : ''"
                    @click="
                      apply();
                    isActive.value = false;
                    ">
                    <span class="text-lowercase">{{ $t('active.tooltips.apply') }}</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
      </v-menu>
    </v-col>
  </v-row>
  <cc-masonry-grid :items="features"
    :xl-columns="xlColumns">
    <template #default="{ item }">
      <fieldset class="px-2"
        style="border-color: rgba(155, 155, 155, 0.6)">
        <unit-feature-card :key="item.ID"
          :item="item"
          :unit="unit"
          @deploy="$emit('deploy', $event)" />
      </fieldset>
    </template>
  </cc-masonry-grid>
</template>

<script setup lang="ts">
import type { Unit } from '@/classes/npc/unit/Unit'
import { useEncounterContext } from '../../encounterContext'
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify';
import UnitFeatureCard from './_unitFeatureCard.vue';
import * as _ from 'lodash-es';
import { UserStore } from '@/stores';

defineOptions({ name: 'MechCombatLoadout' })

const { smAndDown: mobile } = useDisplay()

const { encounterInstance } = useEncounterContext()

const props = defineProps<{
  unit: Unit
}>()

defineEmits<{
  'deploy': [value: any]

}>()

const result = ref(0)
const hiddenFeatureCount = ref(0)

const hidePassives = computed({
  get: () => UserStore().User.View('npcCombatHidePassives', false),
  set: (val: boolean) => { UserStore().User.SetView('npcCombatHidePassives', val); },
})
const xlColumns = computed(() => {
  if (mobile.value) return 1
  else return encounterInstance.value.MaxMasonryColumns
})
const features = computed(() => {
  let features = props.unit.NpcFeatureController.Features.filter((x) => !x.Mod).sort((a, b) => {
    const getPriority = (item) => {
      if (item.DamageData?.length > 0) return 1;
      if (item.Actions?.length > 0) return 2;
      if (item.Deployables?.length > 0) return 3;
      return 4;
    };
    return getPriority(a) - getPriority(b);
  });

  if (hidePassives.value) {
    features = features.filter((feature: any) => !feature.IsCombatPassive);
  }
  return features;
})
const rechargedFeatures = computed(() => {
  if (result.value === 0) {
    return [];
  }
  return features.value.filter(
    (feature: any) => feature.Recharge > 0 && result.value >= feature.Recharge && feature.Used
  );
})

function roll() {
  result.value = Math.floor(Math.random() * 6) + 1;
}
function apply() {
  features.value.forEach((feature) => {
    if (result.value >= feature.Recharge) {
      feature.Used = false;
    }
  });
  result.value = 0;
}

</script>
