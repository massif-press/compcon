<template>
  <v-row align="end" justify="space-between" class="pb-1 mt-n2">
    <v-col>
      <div class="text-cc-overline text-disabled">// NPC FEATURES</div>
    </v-col>
    <v-col cols="auto">
      <v-menu location="top" :close-on-content-click="false" width="400">
        <template #activator="{ props }">
          <cc-button
            color="primary"
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
              <div v-if="result > 0" class="text-center my-2">
                <div class="heading h1">{{ result }}</div>
                <div class="text-cc-overline mt-1">
                  Recharges the following features:
                  <div v-if="rechargedFeatures.length === 0" class="my-1">
                    <i class="text-disabled">None</i>
                  </div>
                  <div v-for="feature in rechargedFeatures" :key="feature.ID">
                    <div
                      v-if="result >= feature.Recharge && feature.Used"
                      class="my-1 text-text body-text bg-panel rounded pa-1">
                      {{ feature.Name }}
                      <div class="text-disabled text-cc-overline">
                        (Recharges on {{ feature.Recharge }}+)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center mb-2">
                <i class="text-disabled">
                  Click to roll. NPC Features will recharge on rolls equal to or higher than their
                  roll value.
                </i>
              </div>
              <v-row>
                <v-col>
                  <v-btn
                    flat
                    size="small"
                    tile
                    block
                    :color="result ? 'panel' : 'primary'"
                    @click="roll">
                    {{ result ? 'reroll' : 'roll' }}
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    flat
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
  <masonry-wall :items="features" :column-width="600" :gap="16" :min-columns="1" :max-columns="4">
    <template #default="{ item }">
      <fieldset class="px-2" style="border-color: rgba(155, 155, 155, 0.6)">
        <unit-feature-card
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
      return this.unit.NpcFeatureController.Features.filter((x) => !x.Mod).sort((a, b) => {
        if (a.Actions?.length > 0 && b.Actions?.length === 0) return -1;
        if (a.Actions?.length === 0 && b.Actions?.length > 0) return 1;
        if (a.Deployables?.length > 0 && b.Deployables?.length === 0) return -1;
        if (a.Deployables?.length === 0 && b.Deployables?.length > 0) return 1;
        if (a.Damage?.length > 0 && b.Damage?.length === 0) return -1;
        if (a.Damage?.length === 0 && b.Damage?.length > 0) return 1;
        return 0;
      });
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
