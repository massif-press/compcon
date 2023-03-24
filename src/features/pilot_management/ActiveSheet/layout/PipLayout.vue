<template>
  <div>
    <v-row align="start" dense justify="space-between">
      <v-col
        v-if="$vuetify.display.smAndDown"
        cols="12"
        align-self="center"
        class="ml-auto text-center"
      >
        <fieldset class="ma-0 py-0 px-3" style="height: 100%">
          <legend class="overline px-1 mb-n1" style="line-height: 0">
            Active Effects
          </legend>
          <cc-synergy-display
            large
            location="active_effects"
            :mech="mech"
            show-none
          />
        </fieldset>
      </v-col>
      <v-col cols="12" md="auto">
        <cc-tick-bar
          :key="mech.CurrentMove"
          :current="mech.CurrentMove"
          :max="mech.MaxMove"
          large
          color="action--move"
          full-icon="mdi-arrow-right-bold-hexagon-outline"
          clearable
          @update="state.SetMove($event)"
        >
          <div :class="`heading ${$vuetify.display.smAndDown ? 'h4' : 'h3'}`">
            Movement
          </div>
        </cc-tick-bar>
      </v-col>
      <v-col cols="12" md="auto">
        <v-fade-transition>
          <cc-tick-bar
            v-if="mech.Boost"
            :key="mech.Boost"
            :current="mech.Boost"
            :max="mech.MaxMove"
            large
            color="secondary"
            full-icon="mdi-arrow-right-bold-hexagon-outline"
            clearable
            no-input
            @update="state.SetBoost($event)"
          >
            <div :class="`heading ${$vuetify.display.smAndDown ? 'h4' : 'h3'}`">
              Boost
            </div>
          </cc-tick-bar>
        </v-fade-transition>
      </v-col>
      <v-col cols="auto" align-self="end">
        <cc-synergy-display
          large
          location="move"
          :mech="mech"
          class="d-inline"
        />
      </v-col>
      <v-col
        v-if="$vuetify.display.mdAndUp"
        cols="auto"
        align-self="center"
        class="ml-auto text-center"
      >
        <fieldset class="ma-0 py-0 px-3" style="height: 100%">
          <legend class="overline px-1 mb-n1" style="line-height: 0">
            Active Effects
          </legend>
          <cc-synergy-display
            large
            location="active_effects"
            :mech="mech"
            show-none
          />
        </fieldset>
      </v-col>
      <v-col v-if="!$vuetify.display.smAndDown" cols="auto" align-self="center">
        <slot name="repair" />
      </v-col>
    </v-row>
    <v-row
      align="start"
      dense
      :class="
        $vuetify.display.smAndDown
          ? 'justify-space-between'
          : 'justify-space-around'
      "
      class="mt-n3"
    >
      <v-col cols="auto">
        <v-row dense>
          <v-col cols="auto" align-self="end" class="ma-0 pa-0">
            <cc-synergy-display
              large
              location="structure"
              :mech="mech"
              class="d-inline"
            />
          </v-col>
          <v-col cols="auto">
            <cc-tick-bar
              :key="mech.CurrentStructure"
              :current="mech.CurrentStructure"
              :max="mech.MaxStructure"
              large
              :number-only="$vuetify.display.smAndDown"
              :no-input="$vuetify.display.smAndDown"
              :show-buttons="$vuetify.display.smAndDown"
              color="structure"
              full-icon="cc:structure"
              :class="{ rolledOver: structRollover }"
              @update="state.SetStructure($event)"
            >
              <div
                :class="`heading ${$vuetify.display.smAndDown ? 'h4' : 'h3'}`"
              >
                Structure
              </div>
            </cc-tick-bar>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-if="$vuetify.display.smAndDown && mech.Armor" cols="auto">
        <v-col cols="auto" align-self="end" class="ma-0 pa-0">
          <cc-synergy-display
            large
            location="armor"
            :mech="mech"
            class="d-inline"
          />
        </v-col>
        <cc-tick-bar
          :key="mech.Armor"
          :current="mech.Armor"
          :max="mech.Armor"
          large
          color="armor"
          full-icon="mdi-shield"
          number-only
          hide-buttons
          hide-values
          readonly
          justify="center"
        >
          <div class="heading h3">Armor: {{ mech.Armor }}</div>
        </cc-tick-bar>
      </v-col>
      <v-col>
        <v-row
          dense
          :class="
            $vuetify.display.smAndDown
              ? 'justify-space-between'
              : 'justify-space-around'
          "
        >
          <v-col v-if="$vuetify.display.mdAndUp && mech.Armor" cols="auto">
            <v-col cols="auto" align-self="end" class="ma-0 pa-0">
              <cc-synergy-display
                large
                location="armor"
                :mech="mech"
                class="d-inline"
              />
            </v-col>
            <cc-tick-bar
              :key="mech.Armor"
              :current="mech.Armor"
              :max="mech.Armor"
              large
              color="armor"
              full-icon="mdi-shield"
              number-only
              hide-buttons
              hide-values
              readonly
              justify="center"
            >
              <div class="heading h3">Armor: {{ mech.Armor }}</div>
            </cc-tick-bar>
          </v-col>
          <v-col
            v-if="$vuetify.display.mdAndUp"
            cols="auto"
            align-self="end"
            class="ma-0 pa-0"
          >
            <cc-synergy-display
              large
              location="hp"
              :mech="mech"
              class="d-inline"
            />
          </v-col>
          <v-col cols="auto">
            <cc-tick-bar
              :key="mech.CurrentHP"
              :current="mech.CurrentHP"
              :max="mech.MaxHP"
              large
              color="hp"
              :full-icon="hpResistance ? 'mdi-octagram' : 'mdi-hexagon'"
              :max-length="$vuetify.display.xl ? 35 : 20"
              :number-only="$vuetify.display.smAndDown"
              :no-input="$vuetify.display.smAndDown"
              :show-buttons="$vuetify.display.smAndDown"
              justify="start"
              @update="state.SetHp($event)"
            >
              <div
                :class="`heading ${$vuetify.display.smAndDown ? 'h4' : 'h3'}`"
              >
                HP
              </div>
            </cc-tick-bar>
          </v-col>
          <v-col cols="auto">
            <v-col cols="auto" align-self="end" class="ma-0 pa-0">
              <cc-synergy-display
                large
                location="overshield"
                :mech="mech"
                class="d-inline"
              />
            </v-col>
            <cc-tick-bar
              :key="mech.Overshield"
              :current="mech.Overshield"
              :max="mech.Overshield"
              large
              color="stark"
              :full-icon="'mdi-octagram'"
              justify="center"
              :max-length="6"
              :number-only="$vuetify.display.smAndDown"
              :no-input="$vuetify.display.smAndDown"
              :show-buttons="$vuetify.display.smAndDown"
              hide-max
              clearable
              @update="state.SetOvershield($event)"
            >
              <div
                :class="`heading ${$vuetify.display.smAndDown ? 'h4' : 'h3'}`"
              >
                OVERSHIELD: {{ mech.Overshield }}
              </div>
            </cc-tick-bar>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row
      align="start"
      class="mt-n3"
      :class="
        $vuetify.display.smAndDown
          ? 'justify-space-between'
          : 'justify-space-around'
      "
    >
      <v-col cols="auto">
        <v-row dense>
          <v-col cols="auto" align-self="end" class="ma-0 pa-0">
            <cc-synergy-display
              large
              location="stress"
              :mech="mech"
              class="d-inline"
            />
          </v-col>
          <v-col cols="auto">
            <cc-tick-bar
              :key="mech.CurrentStress"
              :current="mech.CurrentStress"
              :max="mech.MaxStress"
              large
              :number-only="$vuetify.display.smAndDown"
              :no-input="$vuetify.display.smAndDown"
              :show-buttons="$vuetify.display.smAndDown"
              color="stress"
              full-icon="cc:reactor"
              :class="{ rolledOver: stressRollover }"
              @update="state.SetStress($event)"
            >
              <div
                :class="`heading ${$vuetify.display.smAndDown ? 'h4' : 'h3'}`"
              >
                Stress
              </div>
            </cc-tick-bar>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-if="$vuetify.display.smAndDown" cols="auto">
        <v-col cols="auto" align-self="end" class="ma-0 pa-0">
          <cc-synergy-display
            large
            location="core_energy"
            :mech="mech"
            class="d-inline"
          />
        </v-col>
        <cc-tick-bar
          :key="mech.CurrentCoreEnergy"
          :current="mech.CurrentCoreEnergy"
          :max="1"
          large
          no-input
          clearable
          color="corepower"
          justify="center"
          empty-icon="mdi-battery-10"
          full-icon="mdi-battery"
          hide-values
          hide-buttons
          @update="state.SetCorePower($event)"
        >
          <span :class="`heading h3`">CORE</span>
        </cc-tick-bar>
        <div v-if="$vuetify.display.mdAndUp">
          <div
            v-if="mech.CurrentCoreEnergy"
            class="text-center caption font-weight-bold corepower--text"
          >
            AVAILABLE
          </div>
          <div v-else class="text-center caption subtle--text">EXHAUSTED</div>
        </div>
      </v-col>
      <v-col>
        <v-row
          dense
          :class="
            $vuetify.display.smAndDown
              ? 'mt-n4 justify-space-between'
              : 'justify-space-around'
          "
        >
          <v-col cols="auto">
            <v-col cols="auto" align-self="end" class="ma-0 pa-0">
              <cc-synergy-display
                large
                location="heat"
                :mech="mech"
                class="d-inline"
              />
            </v-col>
            <cc-tick-bar
              :key="mech.CurrentHeat"
              :current="mech.CurrentHeat"
              :max="mech.HeatCapacity"
              large
              :number-only="$vuetify.display.smAndDown"
              :no-input="$vuetify.display.smAndDown"
              :show-buttons="$vuetify.display.smAndDown"
              :color="mech.IsInDangerZone ? 'dangerzone' : 'heatcap'"
              :full-icon="mech.IsInDangerZone ? 'mdi-fire' : 'mdi-circle'"
              clearable
              @update="state.SetHeat($event)"
            >
              <span
                v-if="mech.IsInDangerZone"
                class="dangerzone--text heading h3"
                >HEAT</span
              >
              <span
                v-else
                :class="`heading ${$vuetify.display.smAndDown ? 'h4' : 'h3'}`"
              >
                HEAT
              </span>
            </cc-tick-bar>
            <div
              v-if="!$vuetify.display.smAndDown && mech.IsInDangerZone"
              class="caption font-weight-bold dangerzone--text text-center"
            >
              // HEAT::DANGER ZONE //
            </div>
            <div
              v-else-if="!$vuetify.display.smAndDown"
              class="caption subtle--text text-center"
            >
              HEAT LEVELS NOMINAL
            </div>
          </v-col>
          <v-col cols="auto">
            <v-col cols="auto" align-self="end" class="ma-0 pa-0">
              <cc-synergy-display
                large
                location="repairs"
                :mech="mech"
                class="d-inline"
              />
            </v-col>
            <cc-tick-bar
              :key="mech.CurrentRepairs"
              :current="mech.CurrentRepairs"
              :max="mech.RepairCapacity"
              large
              color="repcap"
              full-icon="cc:repair"
              :number-only="$vuetify.display.smAndDown"
              :no-input="$vuetify.display.smAndDown"
              :show-buttons="$vuetify.display.smAndDown"
              @update="state.SetRepCap($event)"
            >
              <span
                v-if="$vuetify.display.mdAndDown"
                :class="`heading ${$vuetify.display.smAndDown ? 'h4' : 'h3'}`"
              >
                REPAIR
              </span>
              <span
                v-else
                :class="`heading ${$vuetify.display.smAndDown ? 'h4' : 'h3'}`"
              >
                REPAIR CAPACITY
              </span>
            </cc-tick-bar>
          </v-col>
          <v-col cols="auto">
            <v-col cols="auto" align-self="end" class="ma-0 pa-0">
              <cc-synergy-display
                large
                location="overcharge"
                :mech="mech"
                class="d-inline"
              />
            </v-col>
            <cc-tick-bar
              :key="mech.CurrentOvercharge"
              :current="mech.CurrentOvercharge"
              :max="mech.OverchargeTrack.length - 1"
              large
              no-input
              clearable
              color="overcharge"
              full-icon="mdi-alert-decagram"
              justify="center"
              hide-values
              @update="state.SetOvercharge($event)"
            >
              <div
                :class="`heading ${$vuetify.display.smAndDown ? 'h4' : 'h3'}`"
              >
                Overcharge
              </div>
            </cc-tick-bar>
            <div class="text-center caption overcharge--text font-weight-bold">
              +{{ mech.OverchargeTrack[mech.CurrentOvercharge] }}
            </div>
          </v-col>
          <v-col v-if="$vuetify.display.mdAndUp" cols="auto">
            <v-col cols="auto" align-self="end" class="ma-0 pa-0">
              <cc-synergy-display
                large
                location="core_energy"
                :mech="mech"
                class="d-inline"
              />
            </v-col>
            <cc-tick-bar
              :key="mech.CurrentCoreEnergy"
              :current="mech.CurrentCoreEnergy"
              :max="1"
              large
              no-input
              clearable
              color="corepower"
              justify="center"
              empty-icon="mdi-battery-10"
              full-icon="mdi-battery"
              hide-values
              hide-buttons
              @update="state.SetCorePower($event)"
            >
              <span
                v-if="$vuetify.display.mdAndDown"
                :class="`heading ${$vuetify.display.smAndDown ? 'h4' : 'h3'}`"
              >
                CP
              </span>
              <span
                v-else
                :class="`heading ${$vuetify.display.smAndDown ? 'h4' : 'h3'}`"
              >
                CORE POWER
              </span>
            </cc-tick-bar>
            <div
              v-if="mech.CurrentCoreEnergy"
              class="text-center caption font-weight-bold corepower--text"
            >
              AVAILABLE
            </div>
            <div v-else class="text-center caption subtle--text">EXHAUSTED</div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
export default {
  name: 'pip-layout',
  props: {
    mech: {
      type: Object,
      required: true,
    },
    structRollover: { type: Boolean },
    stressRollover: { type: Boolean },
    hpResistance: { type: Boolean },
  },
  computed: {
    state() {
      return this.mech.Pilot.State;
    },
  },
};
</script>
