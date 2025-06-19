<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <cc-button
        block
        size="small"
        color="primary"
        class="mt-2"
        prepend-icon="cc:eclipse"
        @click="props.onClick($event)"
      >
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
          <v-row>
            <v-col>
              <div class="text-cc-overline text-disabled">
                Incoming Damage Value
              </div>
              <v-divider />
              <v-text-field
                type="number"
                min="0"
                max="100"
                class="mt-2 heading h3"
                variant="outlined"
                tile
              />
              <v-btn
                size="x-small"
                class="mt-1"
                block
                flat
                tile
                color="primary"
                @click=""
              >
                Half Damage
              </v-btn>
              <v-btn
                size="x-small"
                class="mt-1"
                block
                flat
                tile
                color="primary"
                @click=""
              >
                Armor Piercing
              </v-btn>
              <v-btn
                size="x-small"
                class="mt-1"
                block
                flat
                tile
                color="primary"
                @click=""
              >
                Irreducible
              </v-btn>
            </v-col>
            <v-col>
              <div class="text-cc-overline text-disabled">Damage Type</div>
              <v-divider />
              <v-row dense class="mt-1">
                <v-col v-for="r in resistances" :key="r.ID" cols="4">
                  <v-tooltip :open-delay="400" location="top" max-width="300">
                    <template #activator="{ props }">
                      <v-card
                        v-bind="props"
                        :color="hasResistance(r) ? r.color : 'panel'"
                        class="px-2 py-1 text-center"
                        flat
                        tile
                        @click=""
                      >
                        <v-icon :icon="r.icon" size="35" />
                      </v-card>
                    </template>
                    <div class="heading h3">{{ r.Name }}</div>
                    {{ r.Terse || r.Effects }}
                  </v-tooltip>
                </v-col>
              </v-row>

              <div class="text-cc-overline text-disabled mt-2">Add Effect</div>
              <v-divider />
              <v-row dense class="mt-1">
                <v-col v-for="s in applicableStatuses" :key="s.ID">
                  <v-tooltip :open-delay="400" location="top" max-width="300">
                    <template #activator="{ props }">
                      <v-card
                        v-bind="props"
                        color="panel"
                        class="px-2 py-1 text-center"
                        flat
                        tile
                        @click=""
                      >
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
              <cc-button
                size="small"
                prepend-icon="mdi-calculator-variant-outline"
                block
                disabled
                color="primary"
              >
                Calculate Total
              </cc-button>
              <v-card
                flat
                tile
                height="208px"
                color="background"
                class="my-2"
              />
              <cc-button
                disabled
                size="small"
                prepend-icon="mdi-check"
                block
                color="primary"
              >
                Apply and Close
              </cc-button>
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
  },
};
</script>
