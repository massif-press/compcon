<template>
  <div class="mx-6">
    <v-row dense align="center">
      <v-col>
        <div v-if="mech.Pilot.PlayerName" class="mb-1">
          <span class="heading h3 stark--text">{{ mech.Pilot.PlayerName }}</span>
          <span class="flavor-text">as</span>
        </div>
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
                      <span class="pt-2 ml-2 caption subtle--text">(ACTIVE)</span>
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
      <v-col cols="auto" class="ml-auto">
        <v-btn v-if="mech.Activations === 0" large color="secondary" @click="mech.Activations += 1">
          Reactivate
        </v-btn>
      </v-col>
    </v-row>

    <v-alert
      v-if="mech.Activations === 0 && !mech.Defeat"
      dark
      dense
      border="left"
      icon="mdi-check"
      color="panel"
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
        <v-row justify="space-around" dense>
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
              append-outer-icon="mdi-plus-circle-outline"
              append-icon="mdi-fire"
              prepend-icon="mdi-minus-circle-outline"
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

        <v-row dense align="center" justify="space-between" class="mt-n3">
          <v-col cols="auto">
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
                Struct
              </span>
            </cc-tick-bar>
          </v-col>
          <v-col v-if="mech.Armor" cols="auto">
            <cc-tick-bar
              :key="mech.Armor"
              :current="mech.Armor"
              :max="mech.Armor"
              large
              color="armor"
              full-icon="mdi-shield"
              readonly
              number-only
              hide-max
            >
              <span class="heading h3">Armor</span>
            </cc-tick-bar>
          </v-col>
          <v-col cols="auto">
            <cc-tick-bar
              :key="mech.CurrentHP"
              :current="mech.CurrentHP"
              :max="mech.MaxHP"
              large
              color="hp"
              rollover
              max-length="20"
              @update="mech.CurrentHP = $event"
              @rollover="onHpRollover"
            >
              <span class="heading h3">HP</span>
            </cc-tick-bar>
          </v-col>
          <v-col cols="auto">
            <cc-tick-bar
              :key="mech.Overshield"
              :current="mech.Overshield"
              :max="mech.Overshield"
              large
              color="stark"
              number-only
              hide-values
              :full-icon="'mdi-octagram'"
              @update="mech.Overshield = $event"
            >
              <span class="heading h3">OVERSHIELD</span>
            </cc-tick-bar>
          </v-col>
        </v-row>

        <v-row dense align="center" justify="space-between">
          <v-col cols="auto">
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
              <span class="heading h3">Reactor</span>
            </cc-tick-bar>
          </v-col>
          <v-col cols="auto">
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
                HEAT
              </span>
              <span v-else class="heading h3">
                HEAT
              </span>
            </cc-tick-bar>
          </v-col>
          <v-col cols="auto">
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
                REPAIR CAP
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
              hide-values
              @update="mech.CurrentCoreEnergy = $event"
            >
              <span class="heading h3">CORE</span>
            </cc-tick-bar>
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
              hide-values
              @update="mech.CurrentOvercharge = $event"
            >
              <span class="heading h3">
                Overcharge&nbsp;
                <span class="text-center overcharge--text font-weight-bold">
                  {{ overcharge[mech.CurrentOvercharge] }}
                </span>
              </span>
            </cc-tick-bar>
          </v-col>
        </v-row>

        <v-row dense align="center" class="mt-2">
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
              <cc-active-card prominent color="pilot" header="Speed" :content="mech.Speed" />
              <cc-active-card
                prominent
                color="pilot"
                header="Attack Bonus"
                :content="`+${mech.AttackBonus}`"
              />
              <cc-active-card
                prominent
                color="pilot"
                header="Tech Attack"
                :content="`${mech.TechAttack > 0 ? '+' : ''}${mech.TechAttack}`"
              />
            </v-row>
            <v-row>
              <cc-active-card
                prominent
                color="pilot"
                header="Evasion"
                :content="mech.IsStunned ? 5 : mech.Evasion"
              />
              <cc-active-card prominent color="pilot" header="E-Defense" :content="mech.EDefense" />
              <cc-active-card
                prominent
                color="pilot"
                header="Save Target"
                :content="mech.SaveTarget"
              />
              <cc-active-card
                prominent
                color="pilot"
                header="Sensor Range"
                :content="mech.SensorRange"
              />
            </v-row>
          </v-col>
          <v-col cols="auto">
            <v-icon size="120" color="accent">{{ mech.SizeIcon }}</v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
        <v-card flat outlined>
          <v-card-text class="pa-1 ml-2">
            <v-img v-if="mech.Image" :key="mech.Image" :src="mech.Image" aspect-ratio="1" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mt-n2">
      <v-col cols="auto">
        <span class="overline">TALENTS</span>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn
          x-small
          outlined
          class="fadeSelect"
          @click="expandAll(mech.Pilot.Talents.length, 'tal_', true)"
        >
          <v-icon small left>mdi-chevron-up</v-icon>
          All
        </v-btn>
        <v-btn
          x-small
          outlined
          class="fadeSelect"
          @click="expandAll(mech.Pilot.Talents.length, 'tal_', false)"
        >
          <v-icon small left>mdi-chevron-down</v-icon>
          All
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <cc-active-card
        v-for="(t, i) in mech.Pilot.Talents"
        :key="`tal_${i}`"
        :ref="`tal_${i}`"
        collapsible
        start-closed
        color="primary"
        md="12"
        lg="6"
        xl="4"
        :header="`${t.Talent.Name} ${'I'.repeat(t.Rank)}`"
        subheader="PILOT TALENT"
      >
        <ul v-for="n in 3" :key="'t_' + n">
          <li v-if="t.Rank >= n">
            <span v-html="t.Talent.Ranks[n - 1].description" />
          </li>
        </ul>
      </cc-active-card>
    </v-row>

    <div class="overline">COUNTERS</div>
    <cc-counter-set :actor="mech.Pilot" />

    <div class="overline mt-n6">LOADOUT</div>
    <v-row dense>
      <player-equipment-item
        v-for="(i, idx) in mech.ActiveLoadout.Equipment"
        :key="i.ID + idx"
        :item="i"
      />
    </v-row>
    <v-divider class="my-2" />
    <cc-title small color="pilot">
      GM's Notes
      <cc-text-editor
        label="Edit Player Notes"
        :original="mech.GmNote"
        @save="mech.GmNote = $event"
      />
    </cc-title>
    <p v-html="mech.GmNote" />
    <v-divider class="my-2" />
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
          <v-icon left dark>cci-reaction</v-icon>
          <span class="heading h3">{{ r }}</span>
        </v-chip>
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
      type: Boolean,
    },
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
    expandAll(len: number, key: string, expand: boolean) {
      for (let i = 0; i < len; i++) {
        const k = key + i
        this.$refs[k][0].collapsed = expand
      }
    },
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
