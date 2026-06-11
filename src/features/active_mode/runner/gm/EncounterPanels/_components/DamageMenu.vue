<template>
  <v-dialog :fullscreen="mobile"
    :min-width="mobile ? '' : '1200px'"
    :max-width="mobile ? '' : '60vw'"
    @after-enter="($refs.damageInput as any)?.$el?.querySelector('input')?.select()">
    <template #activator="{ props }">
      <cc-button block
        size="small"
        color="primary"
        class="mt-1"
        prepend-icon="cc:eclipse"
        @click="props.onClick($event)">
        {{ $t('active.damageMenu.takeDamageLower') }}
      </cc-button>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar height="40"
          color="primary"
          class="text-center">
          <div class="heading h3 mt-1">
            <v-icon icon="cc:eclipse"
              class="mt-n1 ml-2"
              start />
            {{ $t('active.damageMenu.takeDamage') }}
          </div>
          <v-spacer />
          <v-btn icon
            @click="isActive.value = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12"
              md=""
              :style="mobile ? '' : 'max-width: 300px'">
              <div class="text-cc-overline text-disabled">{{ $t('active.damageMenu.incomingValue') }}</div>
              <v-divider />
              <v-text-field ref="damageInput"
                v-model="incomingDamageValue"
                type="number"
                min="0"
                max="100"
                hide-details
                class="mt-2 heading h3"
                variant="outlined"
                tile />
              <v-btn size="x-small"
                class="mt-1"
                block
                flat
                tile
                :color="damageMods.includes('half') ? 'accent' : 'panel'"
                @click="toggleDamageMod('half')">
                {{ $t('active.damageMenu.halfDamage') }}
              </v-btn>
              <v-btn size="x-small"
                class="mt-1"
                block
                flat
                tile
                :color="damageMods.includes('ap') ? 'accent' : 'panel'"
                @click="toggleDamageMod('ap')">
                {{ $t('active.damageMenu.armorPiercing') }}
              </v-btn>
              <v-btn size="x-small"
                class="mt-1"
                block
                flat
                tile
                :color="damageMods.includes('force') ? 'accent' : 'panel'"
                @click="toggleDamageMod('force')">
                {{ $t('active.damageMenu.irreducible') }}
              </v-btn>
              <div class="text-cc-overline text-disabled mt-3">{{ $t('active.damageMenu.damageType') }}</div>
              <v-divider />
              <v-row dense
                class="mt-1">
                <v-col v-for="dmg in damageTypes"
                  :key="dmg.ID"
                  cols="4">
                  <v-tooltip :open-delay="400"
                    location="top"
                    max-width="300">
                    <template #activator="{ props }">
                      <v-card v-bind="props"
                        :color="incomingDamageType.ID === dmg.ID ? dmg.color : 'panel'"
                        class="pa-1 text-center"
                        flat
                        tile
                        @click="incomingDamageType = dmg">
                        <v-icon :icon="dmg.icon"
                          size="35" />
                      </v-card>
                    </template>
                    <div class="heading h3">{{ dmg.Type }}</div>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12"
              md="">
              <div class="text-cc-overline text-disabled">{{ $t('active.damageMenu.defenderStatus') }}</div>
              <v-divider class="mb-2" />
              <v-row v-if="controller.StatController.CurrentStats['armor']"
                no-gutters
                justify="center"
                :class="damageMods.includes('ap') ? 'bg-grey' : 'bg-info'"
                class="text-center my-1 px-2">
                <v-col cols="auto">
                  <v-icon
                    :icon="damageMods.includes('ap') ? 'mdi-shield-off-outline' : 'mdi-shield'" />
                </v-col>
                <v-col class="text-cc-overline mt-1"
                  :style="damageMods.includes('ap') ? 'text-decoration: line-through' : ''">
                  {{ $t('active.damageMenu.armorN', { n: controller.StatController.CurrentStats['armor'] || 0 }) }}
                </v-col>
              </v-row>
              <v-row v-for="damage in controller.Resistances"
                :key="`${damage.type}-${damage.condition}`"
                no-gutters
                justify="center"
                :class="damageClass(damage)"
                class="text-center my-1 px-2">
                <v-col cols="auto">
                  <v-icon :icon="`cc:${damage.type.toLowerCase()}`" />
                </v-col>
                <v-col class="text-cc-overline mt-1">
                  {{ damage.type }} {{ damage.condition }}
                </v-col>
              </v-row>

              <v-card v-for="s in getActiveStatuses"
                :key="s.id"
                flat
                tile
                class="py-1 text-center"
                color="damage--burn">
                <v-icon :icon="s.icon"
                  start
                  class="mt-n1" />
                <div class=text-cc-overline>{{ s.title }}</div>
                <v-divider />
                <div class=text-caption>{{ s.description }}</div>
              </v-card>

              <v-card v-if="!getActiveStatuses.length && !controller.Resistances.length"
                flat
                tile
                class="py-1 text-center text-cc-overline"
                style="opacity: 0.75"
                color="panel">
                {{ $t('active.damageMenu.nominal') }}
              </v-card>
            </v-col>
            <v-col>
              <div class="text-cc-overline text-disabled">{{ $t('active.damageMenu.totalDamage') }}</div>
              <v-divider class="mb-2" />
              <v-card flat
                tile
                color="background"
                class="my-2 pr-6">
                <v-row dense
                  class="text-cc-overline"
                  align="center">
                  <v-col>
                    <v-text-field :model-value="totalDamage"
                      type="number"
                      readonly
                      hide-details
                      density="compact"
                      variant="outlined"
                      tile />
                  </v-col>
                  <v-col cols="auto"
                    class="ml-n1 mr-n5">
                    <v-icon :icon="incomingDamageType.icon"
                      :color="incomingDamageType.color"
                      size="40" />
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-row dense
            justify="end">
            <v-col cols="auto">
              <cc-button prepend-icon="mdi-check"
                color="primary"
                block
                size="small"
                @click="apply(isActive)">{{ $t('active.damageMenu.applyClose') }}</cc-button>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Encounter } from '@/classes/encounter/Encounter'
import { computed, ref } from 'vue'
import * as _ from 'lodash-es';
import { useDisplay } from 'vuetify';
import { CombatController } from '@/classes/components/combat/CombatController';
import { DamageType } from '@/classes/enums';

const { smAndDown: mobile } = useDisplay()

const props = defineProps<{
  controller: CombatController;
  encounter: Encounter
}>()

const damageInput = ref<any>(null)

const incomingDamageValue = ref(0)
const incomingDamageType = ref({ ID: 1, Type: DamageType.Kinetic, icon: 'cc:kinetic', color: 'damage--kinetic' })
const damageMods = ref([] as string[])
const damageTypes = ref([
  { ID: 1, Type: DamageType.Kinetic, icon: 'cc:kinetic', color: 'damage--kinetic' },
  { ID: 2, Type: DamageType.Energy, icon: 'cc:energy', color: 'damage--energy' },
  {
    ID: 3,
    Type: DamageType.Explosive,
    icon: 'cc:explosive',
    color: 'damage--explosive',
  },
  { ID: 4, Type: DamageType.Heat, icon: 'cc:heat', color: 'damage--heat' },
  { ID: 5, Type: DamageType.Burn, icon: 'cc:burn', color: 'damage--burn' },
  { ID: 6, Type: DamageType.AoE, icon: 'cc:blast', color: 'damage--variable' },
])

const getActiveStatuses = computed(() => {
  if (!props.controller || !props.controller.Statuses) return [] as any[];

  const relevantStatuses = [
    {
      id: 'exposed',
      icon: 'cc:status_exposed',
      title: 'Exposed',
      description: 'Kinetic, explosive, and heat damage doubled.',
    },
    {
      id: 'shredded',
      icon: 'cc:condition_shredded',
      title: 'Shredded',
      description: 'Damage ignores armor and resistance.',
    }
  ]

  return props.controller.Statuses.filter(x => relevantStatuses.some(r => r.id === x.status.ID)).map((s) => relevantStatuses.find((as) => as.id === s.status.ID)
  );
})


function damageArgs() {
  let dmg = Number(incomingDamageValue.value);
  if (damageMods.value.includes('half')) dmg = Math.floor(dmg / 2);
  return {
    type: incomingDamageType.value.Type as DamageType,
    dmg,
    ap: damageMods.value.includes('ap'),
    irreducible: damageMods.value.includes('force'),
  };
}

const totalDamage = computed(() => {
  const { type, dmg, ap, irreducible } = damageArgs();
  return props.controller.CalculateDamage(type, dmg, ap, irreducible, 0, true).total;
})

function toggleDamageMod(mod) {
  if (damageMods.value.includes(mod)) {
    damageMods.value = _.without(damageMods.value, mod);
  } else {
    damageMods.value.push(mod);
  }
}
function apply(isActive) {
  const { type, dmg, ap, irreducible } = damageArgs();
  props.controller.TakeDamage(type, dmg, ap, irreducible, true);
  if (isActive) isActive.value = false;
}
function damageClass(damage) {
  if (damage.condition === 'immunity') {
    return 'bg-exotic';
  } else if (damage.condition === 'resistance') {
    return `bg-success`;
  } else if (damage.condition === 'vulnerable') {
    return 'bg-error';
  }
  return '';
}
</script>
