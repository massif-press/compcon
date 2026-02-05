<template>
  <v-row dense
    align="end"
    class="pb-2 mt-n2">
    <v-col cols="auto">
      <div class="text-cc-overline text-disabled">// NPC FEATURES</div>
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
            {{ hiddenFeatureCount }} Hidden Features
          </v-chip>
        </template>
      </v-tooltip>
    </v-col>
    <v-spacer />
    <v-col cols="auto">
      <v-menu location="top"
        :close-on-content-click="false"
        width="400">
        <template #activator="{ props }">
          <cc-button color="primary"
            class="mt-4"
            prepend-icon="mdi-reload"
            @click="props.onClick($event)">
            Roll Recharge
          </cc-button>
        </template>
        <template #default="{ isActive }">
          <v-card border>
            <v-card-text>
              <div class="text-cc-overline mb-2">Recharge Result (d6)</div>
              <div v-if="result > 0"
                class="text-center my-2">
                <div class="heading h1">{{ result }}</div>
                <div class="text-cc-overline mt-1">
                  Recharges the following features:
                  <div v-if="rechargedFeatures.length === 0"
                    class="my-1">
                    <i class="text-disabled">None</i>
                  </div>
                  <div v-for="feature in rechargedFeatures"
                    :key="feature.ID">
                    <div v-if="result >= feature.Recharge && feature.Used"
                      class="my-1 text-text body-text bg-panel rounded pa-1">
                      {{ feature.Name }}
                      <div class="text-disabled text-cc-overline">
                        (Recharges on {{ feature.Recharge }}+)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else
                class="text-center mb-2">
                <i class="text-disabled">
                  Click to roll. NPC Features will recharge on rolls equal to or higher than their
                  roll value.
                </i>
              </div>
              <v-row>
                <v-col>
                  <v-btn flat
                    size="small"
                    tile
                    block
                    :color="result ? 'panel' : 'primary'"
                    @click="roll">
                    {{ result ? 'reroll' : 'roll' }}
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
                    apply
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
      </v-menu>
    </v-col>
  </v-row>
  <masonry-wall :items="features"
    :column-width="600"
    :gap="16"
    :min-columns="1"
    :max-columns="4">
    <template #default="{ item }">
      <fieldset class="px-2"
        style="border-color: rgba(155, 155, 155, 0.6)">
        <unit-feature-card :owner="owner"
          :encounter="encounterInstance"
          :key="item.ID"
          :item="item"
          :unit="unit"
          @deploy="$emit('deploy', $event)" />
      </fieldset>
    </template>
  </masonry-wall>
</template>

<script>
import UnitFeatureCard from './_unitFeatureCard.vue';
import _ from 'lodash';

export default {
  name: 'mech-combat-loadout',
  components: {
    UnitFeatureCard,
  },
  props: {
    owner: {
      type: Object,
      required: true,
    },
    unit: {
      type: Object,
      required: true,
    },
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  emits: ['deploy'],
  data: () => ({
    result: 0,
    hiddenFeatureCount: 0,
    hidePassives: true,
  }),
  methods: {
    roll() {
      this.result = Math.floor(Math.random() * 6) + 1;
    },
    apply() {
      this.features.forEach((feature) => {
        if (this.result >= feature.Recharge) {
          feature.Used = false;
        }
      });
      this.result = 0;
    },
    getModName(modId) {
      return this.unit.NpcFeatureController.Features.find((x) => x.ID === modId).Name || 'Unknown';
    },
  },
  computed: {
    features() {
      let features = this.unit.NpcFeatureController.Features.filter((x) => !x.Mod).sort((a, b) => {
        const getPriority = (item) => {
          if (item.DamageData?.length > 0) return 1;
          if (item.Actions?.length > 0) return 2;
          if (item.Deployables?.length > 0) return 3;
          return 4;
        };
        return getPriority(a) - getPriority(b);
      });
      if (this.hidePassives) {
        features = features.filter((feature) => !feature.IsCombatPassive);
        this.hiddenFeatureCount = this.unit.NpcFeatureController.Features.filter(
          (feature) => feature.IsCombatPassive
        ).length;
      } else {
        this.hiddenFeatureCount = 0;
      }
      return features;
    },
    rechargedFeatures() {
      if (this.result === 0) {
        return [];
      }
      return this.features.filter(
        (feature) => feature.Recharge > 0 && this.result >= feature.Recharge && feature.Used
      );
    },
  },
};
</script>
