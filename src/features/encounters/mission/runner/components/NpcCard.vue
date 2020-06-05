<template>
  <div class="mx-6">
    <v-row dense>
      <v-col>
        <div>
          <span class="heading mech" style="line-height: 25px">{{ npc.Name }}</span>
          <span class="heading h2 light-text--text">
            <cc-slashes />
            {{ npc.Side }}
            {{ typeof npc.Tier === 'number' ? `T${npc.Tier}` : `Custom` }} {{ npc.Class.Name }}
            {{ npc.Templates.map(t => t.Name).join(' ') }} {{ npc.Tag }}
          </span>
        </div>
        <div class="flavor-text mt-n1 ml-2">{{ npc.Subtitle }}</div>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn v-if="npc.Activations === 0" large color="secondary" @click="npc.Activations += 1">
          Reactivate
        </v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="npc.Defeat" prominent color="error" dark border="left" icon="mdi-skull">
      <span class="heading h2">NPC {{ npc.Defeat }}</span>
    </v-alert>

    <v-alert
      v-if="npc.Activations === 0 && !npc.Defeat"
      dark
      dense
      border="left"
      icon="mdi-check"
      color="panel"
    >
      <span class="heading h2">Turn Complete</span>
    </v-alert>

    <v-row dense>
      <v-col>
        <v-row justify="space-between" dense>
          <v-col cols="3">
            <cc-status-select
              :key="npc.Statuses.length"
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
              :key="npc.Conditions.length"
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
              :key="npc.Resistances.length"
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
              append-outer-icon="mdi-plus-circle-outline"
              append-icon="mdi-fire"
              prepend-icon="mdi-minus-circle-outline"
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
          <v-col v-if="npc.MaxStructure > 1" cols="auto" class="mr-1">
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
                Structure
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
              <span class="heading h3">Armor</span>
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
            >
              <span class="heading h3">HP</span>
            </cc-tick-bar>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col v-if="npc.MaxStress > 1" cols="auto">
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
              <span class="heading h3">Reactor</span>
            </cc-tick-bar>
          </v-col>
          <v-col cols="auto" class="mr-4">
            <cc-tick-bar
              v-if="!npc.IsBiological"
              :key="npc.CurrentHeat"
              :current="npc.CurrentHeat"
              :max="npc.HeatCapacity"
              large
              color="dangerzone"
              full-icon="mdi-fire"
              rollover-negative
              clearable
              @update="npc.CurrentHeat = $event"
            >
              <span class="heading h3">HEAT</span>
            </cc-tick-bar>
          </v-col>
          <v-col cols="auto" class="mr-4">
            <cc-tick-bar
              :key="npc.CurrentMove"
              :current="npc.CurrentMove"
              :max="npc.MaxMove"
              large
              color="action--move"
              full-icon="$vuetify.icons.move"
              @update="npc.CurrentMove = $event"
            >
              <span class="heading h3">MOVES</span>
            </cc-tick-bar>
          </v-col>
          <v-col class="mr-4">
            <cc-tick-bar
              :key="npc.Activations"
              :current="npc.Activations"
              :max="npc.Activations"
              large
              color="secondary"
              full-icon="cci-activate"
              readonly
            >
              <span class="heading h3">ACTIVATIONS</span>
            </cc-tick-bar>
          </v-col>
        </v-row>
        <v-row dense align="center">
          <v-col>
            <v-row>
              <cc-active-card
                prominent
                :color="npc.Class.Color"
                header="Hull"
                :content="npc.Stats.Hull || '0'"
              />
              <cc-active-card
                prominent
                :color="npc.Class.Color"
                header="Agility"
                :content="npc.Stats.Agility || '0'"
              />
              <cc-active-card
                prominent
                :color="npc.Class.Color"
                header="Systems"
                :content="npc.Stats.Systems || '0'"
              />
              <cc-active-card
                prominent
                :color="npc.Class.Color"
                header="Engineering"
                :content="npc.Stats.Engineering || '0'"
              />
            </v-row>
            <v-row>
              <cc-active-card
                prominent
                :color="npc.Class.Color"
                header="Save"
                :content="npc.Stats.Save"
              />
              <cc-active-card
                prominent
                :color="npc.Class.Color"
                header="Evade"
                :content="npc.Stats.Evade"
              />
              <cc-active-card
                prominent
                :color="npc.Class.Color"
                header="E-Def"
                :content="npc.Stats.EDefense"
              />
              <cc-active-card
                prominent
                :color="npc.Class.Color"
                header="Sensor"
                :content="npc.Stats.Sensor"
              />
            </v-row>
          </v-col>
          <v-col cols="auto">
            <v-icon size="120" :color="npc.Class.Color">{{ npc.SizeIcon }}</v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-if="npc.HasImage">
        <v-card flat outlined>
          <v-card-text class="pa-1">
            <v-img v-if="npc.Image" :key="npc.Image" :src="npc.Image" aspect-ratio="1" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div class="overline">COUNTERS</div>
    <cc-counter-set :actor="npc" />

    <v-row no-gutters>
      <v-col cols="auto">
        <div class="overline">FEATURES</div>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn-toggle v-model="profile.NpcView" mandatory>
          <v-btn small icon value="list">
            <v-icon color="accent">mdi-view-list</v-icon>
          </v-btn>
          <v-btn small icon value="chips">
            <v-icon color="accent">mdi-view-comfy</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <recharge-menu :npc="npc" />
      </v-col>
    </v-row>
    <v-row v-if="profile.NpcView === 'list'" dense>
      <v-col v-for="(i, idx) in npc.Items" :key="i.Feature.ID + idx" md="12" lg="6" xl="4">
        <cc-npc-item-card
          :item="i"
          active
          @remove-feature="npc.RemoveFeature(i.Feature)"
          @recalc="npc.RecalcBonuses()"
        />
      </v-col>
    </v-row>
    <v-row v-else-if="profile.NpcView === 'chips'" dense>
      <v-chip-group column>
        <cc-npc-item-chip
          v-for="(i, idx) in npc.Items"
          :key="i.Feature.ID + idx"
          :item="i"
          active
          @remove-feature="npc.RemoveFeature(i.Feature)"
          @recalc="npc.RecalcBonuses()"
        />
      </v-chip-group>
    </v-row>
    <v-divider class="my-3" />
    <cc-title small :color="npc.Class.Color">
      NPC Notes
      <cc-text-editor label="Edit NPC Notes" :original="npc.Note" @save="npc.Note = $event" />
    </cc-title>
    <p v-html="npc.Note" />
    <v-divider class="my-3" />
    <v-row v-if="reactions.length" dense justify="center">
      <v-col cols="10">
        <div class="overline">STAGED REACTIONS</div>
        <v-chip-group :key="'cr_' + reactions.length">
          <v-chip
            v-for="(r, i) in reactions"
            :key="r + i"
            dark
            color="action--reaction"
            close
            close-icon="mdi-close"
            class="mx-1"
            @click:close="npc.RemoveReaction(r)"
          >
            <v-icon left dark>cci-reaction</v-icon>
            <span class="heading h3">{{ r }}</span>
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
    <cc-ref-stress-table ref="stressTable" />
    <cc-ref-structure-table ref="structureTable" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import sleep from '@/util/sleep'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import RechargeMenu from './RechargeMenu.vue'
import { UserProfile } from '@/io/User'

export default Vue.extend({
  name: 'npc-card',
  components: { RechargeMenu },
  props: {
    npc: {
      type: Object,
      required: true,
    },
    defeated: {
      type: Boolean,
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
    npcSwitch: false,
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
    reactions() {
      return this.npc.Reactions
    },
    profile(): UserProfile {
      const store = getModule(CompendiumStore, this.$store)
      return store.UserProfile
    },
  },
  watch: {
    'npc.CurrentStructure': {
      async handler(newVal: number, oldVal: number) {
        if (newVal < oldVal) {
          this.structRolledOver = true
          await sleep(500)
          this.structRolledOver = false
          if (this.npc.CurrentStructure > 0) this.$refs.structureTable.show()
        }
      },
    },
    'npc.CurrentStress': {
      async handler(newVal: number, oldVal: number) {
        if (newVal < oldVal) {
          this.stressRolledOver = true
          await sleep(500)
          this.stressRolledOver = false
          if (this.npc.CurrentStress > 0) this.$refs.stressTable.show()
        }
      },
    },
  },
})
</script>
