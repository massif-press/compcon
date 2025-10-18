<template>
  <v-dialog max-width="90vw">
    <template #activator="{ props }">
      <cc-button
        block
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
        <v-toolbar height="40" color="primary" class="text-center">
          <div class="heading h3 mt-1">
            <v-icon icon="cc:eclipse" class="mt-n1 ml-2" start />
            Take Damage
          </div>
          <v-spacer />
          <v-btn icon @click="isActive.value = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div class="text-cc-overline">
            Damage Origin
            <span class="text-disabled">// Optional</span>
          </div>
          <v-row dense>
            <v-col>
              <cc-select
                v-model="damageSource"
                chip-variant="text"
                :items="damageSources"
                :item-title="(x) => `${x.actor.Name} #${x.number}`"
                clearable
                return-object />
            </v-col>
            <v-col>
              <cc-select
                :disabled="!damageSource"
                v-model="damageSourceFeature"
                :items="damageSourceFeatures"
                chip-variant="text"
                :item-title="(x) => `${x.Name} `"
                clearable
                :details="originDamageStrings.length && originDamageStrings.join(', ') + ' Damage'"
                return-object />
            </v-col>
            <v-col cols="auto" v-if="!damageSource">
              <v-btn
                :disabled="!damageSource"
                flat
                tile
                block
                size="small"
                prepend-icon="mdi-plus"
                color="primary"
                @click="setDamageOrigin">
                Add Origin
              </v-btn>
            </v-col>
            <v-col cols="auto" v-if="damageSource">
              <v-btn
                flat
                tile
                block
                size="small"
                prepend-icon="mdi-calculator"
                color="primary"
                @click="setDamageOrigin">
                Recalculate
              </v-btn>
            </v-col>
            <v-col cols="auto" v-if="damageSource">
              <v-btn
                flat
                tile
                block
                size="small"
                prepend-icon="mdi-close"
                color="primary"
                @click="clearDamageOrigin">
                Clear
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col style="max-width: 300px">
              <div class="text-cc-overline text-disabled">Incoming Damage Value</div>
              <v-divider />
              <v-text-field
                v-model="incomingDamageValue"
                type="number"
                min="0"
                max="100"
                hide-details
                class="mt-2 heading h3"
                variant="outlined"
                tile />
              <v-btn
                size="x-small"
                class="mt-1"
                block
                flat
                tile
                :color="damageMods.includes('half') ? 'accent' : 'panel'"
                @click="toggleDamageMod('half')">
                Half Damage
              </v-btn>
              <v-btn
                size="x-small"
                class="mt-1"
                block
                flat
                tile
                :color="damageMods.includes('ap') ? 'accent' : 'panel'"
                @click="toggleDamageMod('ap')">
                Armor Piercing
              </v-btn>
              <v-btn
                size="x-small"
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
              <v-row dense class="mt-1">
                <v-col v-for="dmg in damageTypes" :key="dmg.ID" cols="4">
                  <v-tooltip :open-delay="400" location="top" max-width="300">
                    <template #activator="{ props }">
                      <v-card
                        v-bind="props"
                        :color="incomingDamageType.ID === dmg.ID ? dmg.color : 'panel'"
                        class="pa-1 text-center"
                        flat
                        tile
                        @click="incomingDamageType = dmg">
                        <v-icon :icon="dmg.icon" size="35" />
                      </v-card>
                    </template>
                    <div class="heading h3">{{ dmg.Name }}</div>
                    {{ dmg.Terse || dmg.Effects }}
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>
            <v-col style="max-width: 300px">
              <div class="text-cc-overline text-disabled">Defender Status</div>
              <v-divider class="mb-2" />
              <v-card
                flat
                tile
                class="py-1 text-center"
                color="damage--burn"
                v-if="controller.Statuses.some((x) => x.status.ID === 'exposed')">
                <v-icon icon="cc:status_exposed" start class="mt-n1" />
                EXPOSED
              </v-card>
              <v-card
                flat
                tile
                class="py-1 text-center text-cc-overline"
                style="opacity: 0.75"
                color="panel"
                v-else>
                NOMINAL
              </v-card>

              <div class="text-cc-overline text-disabled mt-2">Add Status</div>
              <v-divider />
              <v-row dense class="mt-1">
                <v-col v-for="s in statuses" :key="s.ID">
                  <v-tooltip :open-delay="400" location="top" max-width="300">
                    <template #activator="{ props }">
                      <v-card
                        v-bind="props"
                        color="panel"
                        class="px-2 py-1 text-center"
                        flat
                        tile
                        :color="
                          controller.Statuses.some((x) => x.status.ID === s.ID)
                            ? 'primary'
                            : 'panel'
                        "
                        @click="toggleAddStatus(s)">
                        <v-icon :icon="s.Icon" size="35" />
                      </v-card>
                    </template>
                    <div class="heading h3">{{ s.Name }}</div>
                    {{ s.Terse || s.Effects }}
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-card flat tile min-height="208px" color="background" class="my-2 px-6">
                <v-row dense class="text-cc-overline" align="center">
                  <v-col>
                    Base Damage
                    <div v-if="damageMods.includes('half')" class="text-disabled">
                      // Incoming damage halved
                    </div>
                  </v-col>
                  <v-col class="text-right" cols="3">
                    <v-text-field
                      type="number"
                      min="0"
                      max="100"
                      hide-details
                      density="compact"
                      variant="outlined"
                      tile
                      class="text-right mt-2"
                      v-model="baseIncomingDamage" />
                  </v-col>
                </v-row>
                <v-row
                  v-if="controller.Statuses.some((x) => x.status.ID === 'exposed')"
                  dense
                  class="text-cc-overline text-error"
                  align="center">
                  <v-col>Defender Exposed</v-col>
                  <v-col cols="1"><v-icon icon="mdi-plus" /></v-col>
                  <v-col cols="3" class="text-right">
                    <v-text-field
                      type="number"
                      min="0"
                      max="100"
                      hide-details
                      density="compact"
                      variant="outlined"
                      tile
                      class="text-right"
                      v-model="exposedDamageAdd" />
                  </v-col>
                </v-row>
                <v-row dense class="text-cc-overline" align="center">
                  <v-col>
                    Defender Armor
                    <div v-if="damageMods.includes('ap')" class="text-error text-disabled">
                      // Armor Piercing
                    </div>
                  </v-col>
                  <v-col cols="1"><v-icon icon="mdi-minus" /></v-col>
                  <v-col cols="3" class="text-right">
                    <v-text-field
                      type="number"
                      min="0"
                      max="100"
                      hide-details
                      density="compact"
                      variant="outlined"
                      tile
                      class="text-right"
                      v-model="defenderArmorValue" />
                  </v-col>
                </v-row>
                <v-row dense class="text-cc-overline" align="center">
                  <v-col>Damage Resistance (Kinetic)</v-col>
                  <v-col cols="1"><v-icon icon="mdi-minus" /></v-col>
                  <v-col cols="3" class="text-right">
                    <v-text-field
                      type="number"
                      min="0"
                      max="100"
                      hide-details
                      density="compact"
                      variant="outlined"
                      tile
                      class="text-right"
                      v-model="defenderResistanceValue" />
                  </v-col>
                </v-row>
                <v-divider class="my-1" />
                <v-row dense class="text-cc-overline" align="center">
                  <v-col>Total Damage</v-col>
                  <v-col cols="1"><v-icon icon="mdi-equal" /></v-col>
                  <v-col cols="3" class="text-right">
                    <v-text-field
                      type="number"
                      min="0"
                      max="100"
                      hide-details
                      density="compact"
                      variant="outlined"
                      tile
                      class="text-right"
                      v-model="totalDamage" />
                  </v-col>
                </v-row>

                <br />
              </v-card>
              <div class="text-cc-overline text-disabled text-center mb-1">
                <v-icon size="small" class="mt-n1" start icon="mdi-alert" />
                COMP/CON may not be able to calculate all damage values. Verify before applying.
                <v-icon size="small" class="mt-n1" end icon="mdi-alert" />
              </div>
              <v-row dense>
                <v-col cols="auto">
                  <v-btn size="small" variant="text" prepend-icon="mdi-reload" color="accent">
                    Reset
                  </v-btn>
                </v-col>
                <v-spacer />
                <v-col cols="auto">
                  <cc-button prepend-icon="mdi-check" color="primary">Apply and Close</cc-button>
                </v-col>
              </v-row>
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
    baseIncomingDamage: 0,
    exposedDamageAdd: 0,
    defenderArmorValue: 0,
    defenderResistanceValue: 0,
    totalDamage: 0,
    incomingDamageType: { ID: 1, Name: 'Kinetic' },
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
    damageSource: null,
    damageSourceFeature: null,
    damageOrigin: null,
    originDamageStrings: [],
  }),
  watch: {
    incomingDamageValue(newValue) {
      this.baseIncomingDamage = newValue;
      if (this.controller.Statuses.some((x) => x.status.ID === 'exposed'))
        this.exposedDamageAdd = this.baseIncomingDamage;
      if (this.damageMods.includes('half')) {
        this.baseIncomingDamage = Math.floor(newValue / 2);
      }

      this.recalc();
    },
    damageMods: {
      handler(newMods) {
        if (newMods.includes('half')) {
          this.baseIncomingDamage = Math.floor(this.incomingDamageValue / 2);
        } else {
          this.baseIncomingDamage = this.incomingDamageValue;
        }
      },
      deep: true,
    },
    damageSourceFeature() {
      this.setDamageOrigin();
    },
  },
  computed: {
    statuses() {
      return _.orderBy(CompendiumStore().Statuses, 'StatusType');
    },
    applicableStatuses() {
      const exclude = [`dangerzone`, `downandout`, `engaged`, `hidden`, `invisible`];
      return this.statuses.filter((s) => !exclude.includes(s.ID));
    },
    defenderDamageResist() {
      return;
    },
    damageSources() {
      return this.encounter.Combatants;
    },
    damageSourceFeatures() {
      if (!this.damageSource) return [];
      let features = this.damageSource.actor.NpcFeatureController?.Features;
      // TODO: v3 data to furnish potential damage values and synergy text
      features.push({ Name: 'Other' });
      return features;
    },
  },
  methods: {
    recalc() {
      this.totalDamage = Math.max(
        0,
        Number(this.baseIncomingDamage) +
          Number(this.exposedDamageAdd) -
          Number(this.defenderArmorValue) -
          Number(this.defenderResistanceValue)
      );
    },
    setDamageOrigin() {
      if (!this.damageSource) return;
      this.damageOrigin = {
        source: this.damageSource,
        feature: this.damageSourceFeature,
      };
      let damage;
      if (this.damageSourceFeature && this.damageSourceFeature.DamageData) {
        damage = this.damageSourceFeature.Damage(this.damageSource.actor.Tier || 1);
        if (damage.length) {
          this.originDamageStrings = damage.map((d) => `${d.Value} ${d.Type}`);
          // TODO: support multiple damage types
          this.incomingDamageType =
            this.damageTypes.find((d) => d.ID === damage[0].Type) || this.incomingDamageType;
          this.incomingDamageValue = damage[0].Value;
        } else {
          this.originDamageStrings = [];
        }
        'Damage from feature:', damage;
      } else {
        this.originDamageStrings = [];
      }
    },
    clearDamageOrigin() {
      this.damageSource = null;
      this.damageSourceFeature = null;
      this.damageOrigin = null;
      this.originDamageStrings = [];
      this.incomingDamageValue = 0;
      this.recalc();
    },
    toggleDamageMod(mod) {
      if (this.damageMods.includes(mod)) {
        this.damageMods = _.without(this.damageMods, mod);
      } else {
        this.damageMods.push(mod);
      }
    },
  },
};
</script>
