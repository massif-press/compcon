<template>
  <div class="mx-6">
    <v-row dense>
      <v-col>
        <span class="heading mech" style="line-height: 15px">
          {{ mech.Pilot.Callsign }}
          <span class="light-text--text">
            <cc-slashes />
            {{ mech.Name }}
          </span>
        </span>
        <div class="heading h3">
          {{ mech.Frame.Source }} {{ mech.Frame.Name }}
          <v-dialog width="75vw">
            <template v-slot:activator="{ on }">
              <v-icon class="fadeSelect" v-on="on">mdi-information-outline</v-icon>
            </template>
            <cc-titled-panel :title="`${mech.Frame.Source} ${mech.Frame.Name}`">
              <v-row dense>
                <v-col cols="4">
                  <cc-active-card
                    v-for="(trait, i) in mech.Frame.Traits"
                    :key="`tr_${i}`"
                    color="frame"
                    :header="trait.name"
                    subheader="FRAME TRAIT"
                  >
                    <span v-html="trait.description" />
                  </cc-active-card>
                </v-col>
                <v-col cols="8">
                  <cc-active-card
                    color="corepower"
                    :header="mech.Frame.CoreSystem.Name"
                    subheader="CORE SYSTEM"
                    style="height: 100%"
                  >
                    <div v-if="mech.Frame.CoreSystem.Passive">
                      <span class="heading h2">Passive</span>
                      <p class="mb-1" v-html="mech.Frame.CoreSystem.Passive" />
                    </div>
                    <span class="heading h2">
                      {{ mech.Frame.CoreSystem.Active }}
                      <span class="pt-2 ml-2 caption grey--text">(ACTIVE)</span>
                    </span>
                    <p class="mb-1" v-html="mech.Frame.CoreSystem.Effect" />
                    <cc-tags :tags="mech.Frame.CoreSystem.Tags" color="corepower" />
                  </cc-active-card>
                </v-col>
              </v-row>
            </cc-titled-panel>
          </v-dialog>
        </div>
      </v-col>
    </v-row>

    <v-alert
      v-if="mech.Activations === 0 && !mech.Defeat"
      prominent
      dark
      dense
      border="left"
      icon="mdi-check"
    >
      <span class="heading h2">Turn Complete</span>
    </v-alert>

    <cc-mech-status-alert
      v-for="s in mech.StatusString"
      :key="`status-${s}`"
      :type="s"
      critical-only
      hide-clear
    />

    <v-row dense>
      <v-col cols="9">
        <v-row justify="space-between" dense>
          <v-col cols="3">
            <cc-status-select
              label="Statuses"
              :items="statuses"
              :model="mech.Statuses"
              dark
              color="deep-orange darken-1"
              @set="mech.Statuses = $event"
            />
          </v-col>
          <v-col cols="3">
            <cc-status-select
              label="Conditions"
              :items="conditions"
              :model="mech.Conditions"
              dark
              color="red darken-2"
              @set="mech.Conditions = $event"
            />
          </v-col>
          <v-col cols="3">
            <cc-status-select
              label="Resistances"
              :items="resistances"
              :model="mech.Resistances"
              dark
              color="blue darken-2"
              @set="mech.Resistances = $event"
            />
          </v-col>

          <v-col cols="auto" class="ml-auto mr-3">
            <v-text-field
              v-model="mech.Burn"
              type="number"
              append-outer-icon="add"
              append-icon="mdi-fire"
              prepend-icon="remove"
              style="width: 115px"
              class="hide-input-spinners"
              hint="BURN"
              persistent-hint
              dense
              @click:append-outer="mech.Burn += 1"
              @click:prepend="mech.Burn -= 1"
              @change="mech.Burn = parseInt($event)"
            />
          </v-col>
        </v-row>

        <v-row dense align="center" class="mt-n3">
          <v-col cols="auto" class="mr-n6">
            <cc-tick-bar
              :key="mech.CurrentStructure"
              :current="mech.CurrentStructure"
              :max="mech.MaxStructure"
              large
              color="structure"
              full-icon="cci-structure"
              :class="{ rolledOver: structRolledOver }"
              @update="mech.CurrentStructure = $event"
            >
              <span class="heading h3">
                Struct: {{ mech.CurrentStructure }}/{{ mech.MaxStructure }}
              </span>
            </cc-tick-bar>
          </v-col>
          <v-col v-if="mech.Armor" cols="auto" class="ml-5">
            <cc-tick-bar
              :key="mech.Armor"
              :current="mech.Armor"
              :max="mech.Armor"
              large
              color="armor"
              full-icon="mdi-shield"
              readonly
            >
              <span class="heading h3">Armor: {{ mech.Armor }}</span>
            </cc-tick-bar>
          </v-col>
          <v-col cols="auto" class="ml-5">
            <cc-tick-bar
              :key="mech.CurrentHP"
              :current="mech.CurrentHP"
              :max="mech.MaxHP"
              large
              color="hp"
              rollover
              @update="mech.CurrentHP = $event"
              @rollover="onHpRollover"
            >
              <span class="heading h3">HP: {{ mech.CurrentHP }}/{{ mech.MaxHP }}</span>
            </cc-tick-bar>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="auto" class="mr-n6">
            <cc-tick-bar
              :key="mech.CurrentStress"
              :current="mech.CurrentStress"
              :max="mech.MaxStress"
              large
              color="stress"
              full-icon="cci-reactor"
              :class="{ rolledOver: stressRolledOver }"
              @update="mech.CurrentStress = $event"
            >
              <span class="heading h3">Reactor: {{ mech.CurrentStress }}/{{ mech.MaxStress }}</span>
            </cc-tick-bar>
          </v-col>
          <v-col class="ml-5">
            <cc-tick-bar
              :key="mech.CurrentHeat"
              :current="mech.CurrentHeat"
              :max="mech.HeatCapacity"
              large
              :color="mech.IsInDangerZone ? 'dangerzone' : 'heatcap'"
              :full-icon="mech.IsInDangerZone ? 'mdi-fire' : 'mdi-circle'"
              rollover-negative
              clearable
              @update="mech.CurrentHeat = $event"
              @rollover="onHeatRollover"
            >
              <span v-if="mech.IsInDangerZone" class="dangerzone--text heading h3">
                HEAT: {{ mech.CurrentHeat }}/{{ mech.HeatCapacity }}
              </span>
              <span v-else class="heading h3">
                HEAT: {{ mech.CurrentHeat }}/{{ mech.HeatCapacity }}
              </span>
            </cc-tick-bar>
            <div
              v-if="mech.IsInDangerZone"
              class="caption font-weight-bold dangerzone--text text-center"
            >
              // ALERT::HEAT LEVELS CRITICAL //
            </div>
            <div v-else class="caption grey--text text-center">
              HEAT LEVELS NOMINAL
            </div>
          </v-col>
          <v-col>
            <cc-tick-bar
              :key="mech.CurrentRepairs"
              :current="mech.CurrentRepairs"
              :max="mech.RepairCapacity"
              large
              color="repcap"
              full-icon="control_point"
              @update="mech.CurrentRepairs = $event"
            >
              <span class="heading h3">
                REPAIR CAP: {{ mech.CurrentRepairs }}/{{ mech.RepairCapacity }}
              </span>
            </cc-tick-bar>
          </v-col>
          <v-col cols="auto">
            <cc-tick-bar
              :key="mech.CurrentCoreEnergy"
              :current="mech.CurrentCoreEnergy"
              :max="1"
              large
              no-input
              clearable
              color="corepower"
              class="text-center"
              empty-icon="mdi-battery-10"
              full-icon="mdi-battery"
              @update="mech.CurrentCoreEnergy = $event"
            >
              <span class="heading h3">CORE</span>
            </cc-tick-bar>
            <div
              v-if="mech.CurrentCoreEnergy"
              class="text-center caption font-weight-bold corepower--text"
            >
              AVAILABLE
            </div>
            <div v-else class="text-center caption grey--text">
              EXHAUSTED
            </div>
          </v-col>
          <v-col cols="auto">
            <cc-tick-bar
              :key="mech.CurrentOvercharge"
              :current="mech.CurrentOvercharge"
              :max="3"
              large
              no-input
              clearable
              color="overcharge"
              full-icon="mdi-alert-decagram"
              class="text-center"
              @update="mech.CurrentOvercharge = $event"
            >
              <span class="heading h3">
                Overcharge
              </span>
            </cc-tick-bar>
            <div class="text-center caption overcharge--text font-weight-bold">
              {{ overcharge[mech.CurrentOvercharge] }}
            </div>
          </v-col>
        </v-row>

        <v-row dense align="center">
          <v-col cols="auto" class="flavor-text mr-2 ml-2 mt-n2">
            <div>
              <span class="heading h2">{{ mech.Hull }}</span>
              <span>//HULL</span>
              <v-divider class="my-1" />
            </div>
            <div>
              <span class="heading h2">{{ mech.Agi }}</span>
              <span>//AGI</span>
              <v-divider class="my-1" />
            </div>
            <div>
              <span class="heading h2">{{ mech.Sys }}</span>
              <span>//SYS</span>
              <v-divider class="my-1" />
            </div>
            <div>
              <span class="heading h2">{{ mech.Eng }}</span>
              <span>//ENG</span>
              <v-divider class="my-1" />
            </div>
          </v-col>
          <v-col>
            <v-row>
              <cc-active-card color="pilot" header="Speed" :content="mech.Speed" />
              <cc-active-card
                color="pilot"
                header="Attack Bonus"
                :content="`+${mech.AttackBonus}`"
              />
              <cc-active-card color="pilot" header="Tech Attack" :content="`+${mech.TechAttack}`" />
            </v-row>
            <v-row>
              <cc-active-card
                color="pilot"
                header="Evasion"
                :content="mech.IsStunned ? 5 : mech.Evasion"
              />
              <cc-active-card color="pilot" header="E-Defense" :content="mech.EDefense" />
              <cc-active-card color="pilot" header="Save Target" :content="mech.SaveTarget" />
              <cc-active-card color="pilot" header="Sensor Range" :content="mech.SensorRange" />
            </v-row>
          </v-col>
          <v-col cols="auto">
            <v-icon size="120" color="pilot">cci-size-{{ mech.Size }}</v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
        <v-card flat outlined>
          <v-card-text class="pa-1">
            <v-img v-if="mech.Image" :key="mech.Image" :src="mech.Image" aspect-ratio="1" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <div class="overline">LOADOUT</div>
    <v-row dense>
      <player-equipment-item
        v-for="(i, idx) in mech.ActiveLoadout.Equipment"
        :key="i.ID + idx"
        :item="i"
      />
    </v-row>
    <v-divider class="my-2" />
    <v-row dense>
      <v-textarea
        v-model="mech.GmNote"
        label="GM Notes"
        dense
        auto-grow
        rows="3"
        outlined
        hide-actions
      />
    </v-row>
    <v-row v-if="mech.Reactions.length && !rest" dense justify="center">
      <v-col cols="10">
        <div class="overline">STAGED REACTIONS</div>
        <v-chip
          v-for="(r, i) in mech.Reactions"
          :key="r + i"
          dark
          color="action--reaction"
          close
          close-icon="mdi-close"
          class="mx-1"
          @click:close="mech.RemoveReaction(r)"
        >
          <v-icon left dark>mdi-redo-variant</v-icon>
          <span class="heading h3">{{ r }}</span>
        </v-chip>
      </v-col>
    </v-row>
    <v-row v-if="!rest" dense justify="start" class="mb-10">
      <v-col v-if="!mech.Defeat">
        <v-btn
          block
          x-large
          color="secondary"
          :disabled="mech.Activations === 0"
          @click="mech.Activations = 0"
        >
          End Turn
        </v-btn>
        <v-slide-y-transition leave-absolute>
          <v-btn
            v-if="mech.Activations === 0"
            block
            outlined
            small
            color="primary"
            class="mt-1"
            @click="mech.Activations += 1"
          >
            Reactivate
          </v-btn>
        </v-slide-y-transition>
      </v-col>
    </v-row>
    <div v-if="rest" style="height: 30px" />
    <cc-stress-table ref="stressTable" :mech="mech" />
    <cc-structure-table ref="structureTable" :mech="mech" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PlayerEquipmentItem from './PlayerEquipmentItem.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'player-card',
  components: { PlayerEquipmentItem },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    rest: {
      type: Boolean
    }
  },
  data: () => ({
    overcharge: [' +1 ', ' +1d3 ', ' +1d6 ', '+1d6+4'],
    resistances: [
      { name: 'Kinetic', color: 'kinetic' },
      { name: 'Energy', color: 'energy' },
      { name: 'Explosive', color: 'explosive' },
      { name: 'Heat', color: 'heat' },
      { name: 'Burn', color: 'burn' },
      { name: 'All', color: 'variable' },
      { name: 'Next Attack', color: 'overcharge' },
    ],
    structRolledOver: false,
    stressRolledOver: false,
  }),
  computed: {
    statuses() {
      const store = getModule(CompendiumStore, this.$store)
      return store.Statuses.filter(x => x.type === 'Status')
    },
    conditions() {
      const store = getModule(CompendiumStore, this.$store)
      return store.Statuses.filter(x => x.type === 'Condition')
    },
  },
  methods: {
    onHpRollover() {
      if (this.mech.CurrentStructure <= 1) {
        this.$nextTick(() => {
          this.mech.CurrentHP = 0
        })
      }
      this.mech.CurrentStructure = this.mech.CurrentStructure - 1
      if (this.mech.CurrentStructure < 0) this.mech.CurrentStructure = 0
      this.structRolledOver = true
      setTimeout(() => {
        this.structRolledOver = false
        this.$refs.structureTable.show()
      }, 500)
    },
    onHeatRollover() {
      if (this.mech.CurrentStress <= 1) {
        this.$nextTick(() => {
          this.mech.CurrentHeat = this.mech.MaxHeat
        })
      }
      this.mech.CurrentStress = this.mech.CurrentStress - 1
      if (this.mech.CurrentStress < 0) this.mech.CurrentStress = 0
      this.stressRolledOver = true
      setTimeout(() => {
        this.stressRolledOver = false
        this.$refs.stressTable.show()
      }, 500)
    },
  },
})
</script>
