<template>
  <div class="mx-6">
    <v-row dense>
      <v-col>
        <span class="heading mech" style="line-height: 15px">
          {{ npc.Name }}
        </span>
        <span class="heading h2 light-text--text">
          <cc-slashes />
          {{ typeof npc.Tier === 'number' ? `T${npc.Tier}` : `Custom` }} {{ npc.Class.Name }}
          {{ npc.Templates.map(t => t.Name).join(' ') }} {{ npc.Tag }}
        </span>
      </v-col>
    </v-row>

    <v-alert v-if="npc.Destroyed" prominent color="error" dark border="left" icon="mdi-skull">
      <span class="heading h2">NPC DESTROYED</span>
    </v-alert>

    <v-alert
      v-if="npc.Activations === 0 && !npc.Destroyed"
      prominent
      dark
      dense
      border="left"
      icon="mdi-check"
    >
      <span class="heading h2">Turn Complete</span>
    </v-alert>

    <v-row dense>
      <v-col cols="9">
        <v-row justify="space-between" dense>
          <v-col cols="3">
            <cc-status-select
              label="Statuses"
              :items="statuses"
              :model="npc.Statuses"
              dark
              color="deep-orange darken-1"
              @set="npc.Statuses = $event"
            />
          </v-col>
          <v-col cols="3">
            <cc-status-select
              label="Conditions"
              :items="conditions"
              :model="npc.Conditions"
              dark
              color="red darken-2"
              @set="npc.Conditions = $event"
            />
          </v-col>
          <v-col cols="3">
            <cc-status-select
              label="Resistances"
              :items="resistances"
              :model="npc.Resistances"
              dark
              color="blue darken-2"
              @set="npc.Resistances = $event"
            />
          </v-col>

          <v-col cols="auto" class="ml-auto mr-3">
            <v-text-field
              v-model="npc.Burn"
              type="number"
              append-outer-icon="add"
              append-icon="mdi-fire"
              prepend-icon="remove"
              style="width: 115px"
              class="hide-input-spinners"
              hint="BURN"
              persistent-hint
              dense
              @click:append-outer="npc.Burn += 1"
              @click:prepend="npc.Burn -= 1"
              @change="npc.Burn = parseInt($event)"
            />
          </v-col>
        </v-row>
        <v-row dense align="center" class="mt-n3">
          <v-col v-if="npc.MaxStructure > 1" cols="2" class="mr-n6">
            <cc-tick-bar
              :key="npc.CurrentStructure"
              :current="npc.CurrentStructure"
              :max="npc.MaxStructure"
              large
              color="structure"
              full-icon="cci-structure"
              :class="{ rolledOver: structRolledOver }"
              @update="npc.CurrentStructure = $event"
            >
              <span class="heading h3">
                Structure: {{ npc.CurrentStructure }}/{{ npc.MaxStructure }}
              </span>
            </cc-tick-bar>
          </v-col>
          <v-col v-if="npc.Stats.Armor" cols="auto" class="mx-1">
            <cc-tick-bar
              :key="npc.Stats.Armor"
              :current="npc.Stats.Armor"
              :max="npc.Stats.Armor"
              large
              color="armor"
              full-icon="mdi-shield"
              readonly
            >
              <span class="heading h3">Armor: {{ npc.Armor }}</span>
            </cc-tick-bar>
          </v-col>
          <v-col cols="auto" class="ml-1">
            <cc-tick-bar
              :key="npc.CurrentHP"
              :current="npc.CurrentHP"
              :max="npc.MaxHP"
              large
              color="hp"
              rollover
              @update="npc.CurrentHP = $event"
              @rollover="onHpRollover"
            >
              <span class="heading h3">HP: {{ npc.CurrentHP }}/{{ npc.MaxHP }}</span>
            </cc-tick-bar>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col v-if="npc.MaxStress > 1" cols="2" class="mr-n6">
            <cc-tick-bar
              :key="npc.CurrentStress"
              :current="npc.CurrentStress"
              :max="npc.MaxStress"
              large
              color="stress"
              full-icon="cci-reactor"
              :class="{ rolledOver: stressRolledOver }"
              @update="npc.CurrentStress = $event"
            >
              <span class="heading h3">Reactor: {{ npc.CurrentStress }}/{{ npc.MaxStress }}</span>
            </cc-tick-bar>
          </v-col>
          <v-col cols="auto" class="mr-4">
            <cc-tick-bar
              :key="npc.CurrentHeat"
              :current="npc.CurrentHeat"
              :max="npc.HeatCapacity"
              large
              color="dangerzone"
              full-icon="mdi-fire"
              rollover-negative
              clearable
              @update="npc.CurrentHeat = $event"
              @rollover="onHeatRollover"
            >
              <span class="heading h3">HEAT: {{ npc.CurrentHeat }}/{{ npc.HeatCapacity }}</span>
            </cc-tick-bar>
          </v-col>
          <v-col class="mr-4">
            <cc-tick-bar
              :key="npc.CurrentMove"
              :current="npc.CurrentMove"
              :max="npc.MaxMove"
              large
              color="action--move"
              full-icon="$vuetify.icons.move"
              @update="npc.CurrentMove = $event"
            >
              <span class="heading h3">MOVES: {{ npc.CurrentMove }}/{{ npc.MaxMove }}</span>
            </cc-tick-bar>
          </v-col>
        </v-row>
        <v-row dense align="center">
          <v-col>
            <v-row>
              <cc-active-card :color="npc.Class.Color" header="Hull" :content="npc.Stats.Hull" />
              <cc-active-card
                :color="npc.Class.Color"
                header="Agility"
                :content="npc.Stats.Agility"
              />
              <cc-active-card
                :color="npc.Class.Color"
                header="Systems"
                :content="npc.Stats.Systems"
              />
              <cc-active-card
                :color="npc.Class.Color"
                header="Engineering"
                :content="npc.Stats.Engineering"
              />
            </v-row>
            <v-row>
              <cc-active-card :color="npc.Class.Color" header="Save" :content="npc.Stats.Save" />
              <cc-active-card :color="npc.Class.Color" header="Evade" :content="npc.Stats.Evade" />
              <cc-active-card
                :color="npc.Class.Color"
                header="E-Def"
                :content="npc.Stats.EDefense"
              />
              <cc-active-card
                :color="npc.Class.Color"
                header="Sensor"
                :content="npc.Stats.Sensor"
              />
            </v-row>
          </v-col>
          <v-col cols="auto">
            <v-icon size="120" :color="npc.Class.Color">cci-size-{{ npc.Stats.Size }}</v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
        <v-card flat outlined>
          <v-card-text class="pa-1">
            <v-img v-if="npc.Image" :key="npc.Image" :src="npc.Image" aspect-ratio="1" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense>
      <v-textarea
        v-model="npc.Note"
        label="GM Notes"
        dense
        auto-grow
        rows="3"
        outlined
        hide-actions
      />
    </v-row>
    <v-row dense justify="center">
      <v-col v-if="!npc.Destroyed" cols="8">
        <v-btn
          block
          outlined
          large
          color="secondary"
          :disabled="npc.Activations === 0"
          @click="npc.Activations -= 1"
        >
          End Turn
        </v-btn>
        <v-slide-y-transition leave-absolute>
          <v-btn
            v-if="npc.Activations === 0"
            block
            outlined
            small
            color="primary"
            class="mt-1"
            @click="npc.Activations += 1"
          >
            Reactivate
          </v-btn>
        </v-slide-y-transition>
      </v-col>
      <v-col cols="auto" class="ml-2">
        options menu
      </v-col>
    </v-row>
    <cc-ref-stress-table ref="stressTable" />
    <cc-ref-structure-table ref="structureTable" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'npc-card',
  props: {
    npc: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
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
      if (this.npc.MaxStructure === 1) {
        this.$nextTick(() => {
          this.npc.CurrentHP = 0
          this.npc.CurrentStructure = 0
          this.npc.Destroyed = true
        })
        return
      }
      if (this.npc.CurrentStructure <= 1) {
        this.$nextTick(() => {
          this.npc.CurrentHP = 0
        })
      }
      this.npc.CurrentStructure = this.npc.CurrentStructure - 1
      if (this.npc.CurrentStructure < 0) this.npc.CurrentStructure = 0
      this.structRolledOver = true
      setTimeout(() => {
        this.structRolledOver = false
        this.$refs.structureTable.show()
      }, 500)
    },
    onHeatRollover() {
      if (this.npc.MaxStress === 1) {
        this.$nextTick(() => {
          this.npc.CurrentHeat = this.npc.HeatCapacity
          this.npc.CurrentStress = 0
          if (!this.npc.Statuses.some(x => x === 'Exposed')) this.npc.Statuses.push('Exposed')
        })
        return
      }
      if (this.npc.CurrentStress <= 1) {
        this.$nextTick(() => {
          this.npc.CurrentHeat = this.npc.HeatCapacity
        })
      }
      this.npc.CurrentStress = this.npc.CurrentStress - 1
      if (this.npc.CurrentStress < 0) this.npc.CurrentStress = 0
      this.stressRolledOver = true
      setTimeout(() => {
        this.stressRolledOver = false
        this.$refs.stressTable.show()
      }, 500)
    },
  },
})
</script>
