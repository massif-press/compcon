<template>
  <v-dialog min-width="1200px"
    max-width="60vw">
    <template #activator="{ props }">
      <cc-button block
        size="small"
        color="primary"
        class="mt-2"
        prepend-icon="cc:eclipse"
        @click="props.onClick($event)">
        Take damage
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
            Take Damage
          </div>
          <v-spacer />
          <v-btn icon
            @click="isActive.value = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col style="max-width: 300px">
              <div class="text-cc-overline text-disabled">Incoming Damage Value</div>
              <v-divider />
              <v-text-field v-model="incomingDamageValue"
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
                Half Damage
              </v-btn>
              <v-btn size="x-small"
                class="mt-1"
                block
                flat
                tile
                :color="damageMods.includes('ap') ? 'accent' : 'panel'"
                @click="toggleDamageMod('ap')">
                Armor Piercing
              </v-btn>
              <v-btn size="x-small"
                class="mt-1"
                block
                flat
                tile
                :color="damageMods.includes('force') ? 'accent' : 'panel'"
                @click="toggleDamageMod('force')">
                Irreducible
              </v-btn>
              <div class="text-cc-overline text-disabled mt-3">Damage Type</div>
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
                    <div class="heading h3">{{ dmg.Name }}</div>
                    {{ dmg.Terse || dmg.Effects }}
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <div class="text-cc-overline text-disabled">Defender Status</div>
              <v-divider class="mb-2" />
              <v-row v-for="damage in controller.Resistances"
                no-gutters
                justify="center"
                :class="damageClass(damage)"
                class="text-center my-1 px-2">
                <v-col cols="auto">
                  <v-icon v-bind="props"
                    :icon="`cc:${damage.type.toLowerCase()}`" />
                </v-col>
                <v-col class="text-cc-overline mt-1">
                  {{ damage.type }} {{ damage.condition }}
                </v-col>
              </v-row>

              <v-card flat
                v-for="s in getActiveStatuses"
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
                NOMINAL
              </v-card>
            </v-col>
            <v-col>
              <div class="text-cc-overline text-disabled">Total Damage</div>
              <v-divider class="mb-2" />
              <v-card flat
                tile
                color="background"
                class="my-2 pr-6">
                <v-row dense
                  class="text-cc-overline"
                  align="center">
                  <v-col>
                    <v-text-field type="number"
                      min="0"
                      max="100"
                      hide-details
                      density="compact"
                      variant="outlined"
                      tile
                      v-model="totalDamage" />
                  </v-col>
                  <v-cols cols="auto"
                    class="ml-n1 mr-n5">
                    <v-icon :icon="incomingDamageType.icon"
                      :color="incomingDamageType.color"
                      size="40" />
                  </v-cols>
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
                @click="apply(isActive)">Apply and
                Close</cc-button>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import _ from 'lodash';
import { CompendiumStore } from '@/stores';

export default {
  name: 'DamageMenu',
  props: {
    controller: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    incomingDamageValue: 0,
    totalDamage: 0,
    incomingDamageType: { ID: 1, Name: 'Kinetic', icon: 'cc:kinetic', color: 'damage--kinetic' },
    damageMods: [],
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
      { ID: 6, Name: 'AoE', icon: 'cc:blast', color: 'damage--variable' },
    ],
  }),
  watch: {
    incomingDamageValue() {
      this.recalc();
    },
    damageMods: {
      handler() {
        this.recalc();
      }, deep: true
    },
  },
  computed: {
    getActiveStatuses() {
      if (!this.controller || !this.controller.Statuses) return [];

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

      return this.controller.Statuses.filter(x => relevantStatuses.some(r => r.id === x.status.ID)).map((s) => relevantStatuses.find((as) => as.id === s.status.ID)
      );
    },
  },
  getActiveResistances() {
    if (!this.controller || !this.controller.Resistances) return [];
    return this.controller.Resistances
  },
  methods: {
    recalc() {
      let dmg = Number(this.incomingDamageValue);
      if (this.damageMods.includes('half')) dmg = Math.floor(dmg / 2);

      this.totalDamage = this.controller.CalculateDamage(
        this.incomingDamageType.Name.toLowerCase(),
        dmg,
        this.damageMods.includes('ap'),
        this.damageMods.includes('force'),
      ).total;
    },
    toggleDamageMod(mod) {
      if (this.damageMods.includes(mod)) {
        this.damageMods = _.without(this.damageMods, mod);
      } else {
        this.damageMods.push(mod);
      }
    },
    apply(isActive) {
      let dmg = Number(this.incomingDamageValue);
      if (this.damageMods.includes('half')) dmg = Math.floor(dmg / 2);

      this.controller.TakeDamage(
        this.incomingDamageType.Name.toLowerCase(),
        dmg,
        this.damageMods.includes('ap'),
        this.damageMods.includes('force'),
      );
      if (isActive) isActive.value = false;
    },

    damageClass(damage) {
      if (damage.condition === 'immunity') {
        return 'bg-exotic';
      } else if (damage.condition === 'resistance') {
        return `bg-success`;
      } else if (damage.condition === 'vulnerability') {
        return 'bg-error';
      }
      return '';
    },
  },
};
</script>
