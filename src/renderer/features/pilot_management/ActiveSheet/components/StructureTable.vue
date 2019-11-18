<template>
  <v-card>
    <v-toolbar color="title-bg" dark flat>
      <v-toolbar-title class="display-2 font-weight-bold">STRUCTURE DAMAGE</v-toolbar-title>
    </v-toolbar>
    <v-window v-model="window">
      <v-window-item>
        <v-card-text class="text-center">
          <span class="fluff-text">
            <b class="minor-title red--text">FRAME INTEGRITY COMPROMISED</b>
            <br />
            Roll 1d6 per point of structure damage
          </span>
          <br />
          <span class="display-2">{{ totalRolls }}d6</span>
          <br />
          <span class="caption capitalize-text">
            <b>{{ totalRolls - rolls.length }}</b>
            rolls remaining
          </span>
          <br />
          <div v-for="n in rolls.length" :key="`rr${n}`" class="d-inline">
            <v-tooltip top>
              <v-btn slot="activator" flat icon @click="rolls.splice(n - 1, 1)">
                <v-icon
                  x-large
                  v-html="`mdi-dice-${rolls[n - 1]}`"
                  :color="rolls[n - 1] === 1 ? 'red accent-4' : 'black'"
                />
              </v-btn>
              <span>Click to re-roll</span>
            </v-tooltip>
          </div>
          <div v-for="n in totalRolls - rolls.length" :key="`er${n}`" class="d-inline">
            <v-btn flat icon x-large disabled>
              <v-icon x-large v-html="'mdi-checkbox-blank-outline'" />
            </v-btn>
          </div>
          <div v-if="rolls.length < totalRolls" class="d-inline">
            <br />
            <v-btn
              class="mt-0 mb-4"
              :ripple="false"
              x-large
              v-for="n in 6"
              :key="`rb${n}`"
              color="primary"
              flat
              icon
              @click="rolls.push(n)"
            >
              <v-icon class="die-hover" size="55px" v-html="`mdi-dice-${n}`" />
            </v-btn>
          </div>
          <br />
          <span
            v-if="rolls.filter(x => x === 1).length > 1"
            class="major-title font-weight-bold capitalize-text red--text"
          >
            // CRITICAL STRUCTURAL DAMAGE //
          </span>
          <span v-else-if="rolls.length" class="minor-title capitalize-text">
            Result:
            <b>{{ Math.min(...rolls) }}</b>
            <i>({{ results[Math.min(...rolls) - 1] }})</i>
          </span>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn flat color="warning" @click="$emit('dismiss')">dismiss</v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            large
            :disabled="totalRolls - rolls.length > 0"
            @click="window = resultWindow"
          >
            continue
          </v-btn>
        </v-card-actions>
      </v-window-item>
      <v-window-item>
        <v-card-title primary-title class="major-title">Glancing Blow</v-card-title>
        <v-card-text class="text-center">
          <p class="fluff-text">
            Emergency systems kick in and stabilize your mech. However, your mech is
            <strong>impaired</strong>
            until the end of your next turn.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="warning" @click="$emit('dismiss')">dismiss</v-btn>
          <v-spacer />
          <v-btn color="primary" flat @click="window = 0">previous</v-btn>
          <v-btn color="success" large @click="applyGlancingBlow">confirm</v-btn>
        </v-card-actions>
      </v-window-item>
      <v-window-item>
        <v-card-title primary-title class="major-title">System Trauma</v-card-title>
        <v-card-text class="text-center">
          <p class="fluff-text">Parts of your mech have been torn off by the damage. Roll a d6.</p>
          <v-btn
            class="mt-0 mb-4"
            :ripple="false"
            x-large
            v-for="n in 6"
            :key="`rb${n}`"
            :color="systemTraumaRoll === n ? 'error' : 'primary'"
            flat
            icon
            @click="systemTraumaRoll = n"
          >
            <v-icon class="die-hover" size="55px" v-html="`mdi-dice-${n}`" />
          </v-btn>
          <div v-if="systemTraumaRoll && systemTraumaRoll <= 3">
            <v-select
              style="margin-left: 30%; margin-right: 30%"
              v-model="destroyedMount"
              label="Mounts"
              :items="destroyableMounts"
              item-text="name"
              item-value="index"
            />
            <span class="effect-text">All weapons on this mount are destroyed</span>
          </div>
          <div v-else-if="systemTraumaRoll && systemTraumaRoll >= 4">
            <v-select
              style="margin-left: 30%; margin-right: 30%"
              v-model="destroyedSystem"
              label="Systems"
              :items="destroyableSystems"
              item-text="Name"
              item-value="ID"
            />
            <span class="effect-text">This system is destroyed</span>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="warning" @click="$emit('dismiss')">dismiss</v-btn>
          <v-spacer />
          <v-btn color="primary" flat @click="window = 0">previous</v-btn>
          <v-btn
            color="success"
            large
            :disabled="
              (systemTraumaRoll <= 3 && destroyedMount === null) ||
                (systemTraumaRoll > 3 && !destroyedSystem)
            "
            @click="applySystemTrauma"
          >
            confirm
          </v-btn>
        </v-card-actions>
      </v-window-item>
      <v-window-item>
        <v-card-title primary-title class="major-title">Direct Hit</v-card-title>
        <v-card-text class="text-center">
          <div class="fluff-text">
            <p v-if="mech.CurrentStructure >= 3">
              Your mech is
              <b>stunned</b>
              until the end of your next turn.
            </p>
            <p v-else>
              Your mech must pass a
              <b>hull</b>
              save or be
              <b>destroyed</b>
              .Even on a successful check, your mech is
              <b>stunned</b>
              until the end of your next turn.
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="warning" @click="$emit('dismiss')">dismiss</v-btn>
          <v-spacer />
          <v-btn color="primary" flat @click="window = 0">previous</v-btn>
          <div v-if="mech.CurrentStructure >= 3">
            <v-btn color="success" large @click="applyDirectHit">confirm</v-btn>
          </div>
          <div v-else>
            <v-btn color="error" large @click="window = 4">fail hull save</v-btn>
            <v-btn color="success" large @click="applyDirectHit">succeed hull save</v-btn>
          </div>
        </v-card-actions>
      </v-window-item>
      <v-window-item>
        <v-card-title primary-title class="major-title">Crushing Hit</v-card-title>
        <v-card-text class="text-center destroyed-bg">
          <p class="major-title red--text pa-3 ma-5" style="background-color:black;">
            MECH DESTROYED
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="warning" @click="$emit('dismiss')">dismiss</v-btn>
          <v-spacer />
          <v-btn color="primary" flat @click="window = 0">previous</v-btn>
          <v-btn color="success" large @click="applyDestroyed">confirm</v-btn>
        </v-card-actions>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'structure-table',
  props: {
    mech: Object,
    loadout: Object,
    pilot: Object,
  },
  data: () => ({
    window: 0,
    rolls: [],
    systemTraumaRoll: null,
    destroyedSystem: null,
    destroyedMount: null,
    results: [
      'Direct Hit',
      'System Trauma',
      'System Trauma',
      'System Trauma',
      'Glancing Blow',
      'Glancing Blow',
    ],
  }),
  computed: {
    totalRolls() {
      return (this.mech.CurrentStructure - this.mech.MaxStructure) * -1
    },
    resultWindow(): number {
      if (this.rolls.filter(x => x === 1).length > 1) return 4
      switch (Math.min(...this.rolls)) {
        case 6:
        case 5:
          return 1
        case 4:
        case 3:
        case 2:
          if (!this.destroyableMounts.length && !this.destroyableSystems.length) return 3
          return 2
        case 1:
          return this.mech.CurrentStructure <= 1 ? 4 : 3
      }
      return 4
    },
    destroyableMounts() {
      return this.loadout
        .AllMounts(this.pilot.has('CoreBonus', 'imparm'), this.pilot.has('CoreBonus', 'intweapon'))
        .filter(x => x.Weapons.some(w => !w.IsDestroyed) && !(x.IsLimited && x.Uses === 0))
        .map((m, i) => ({ name: m.Name, index: i }))
    },
    destroyableSystems() {
      return this.loadout.Systems.filter(x => !x.IsDestroyed && !(x.IsLimited && x.Uses === 0))
    },
  },
  methods: {
    close() {
      this.window = 0
      this.rolls = []
      this.systemTraumaRoll = null
      ;(this.destroyedSystem = null), (this.destroyedMount = null), this.$emit('dismiss')
    },
    applyGlancingBlow() {
      if (!this.mech.Conditions.includes('Impaired')) this.mech.Conditions.push('Impaired')
      this.close()
    },
    applyDirectHit() {
      if (!this.mech.Conditions.includes('Stunned')) this.mech.Conditions.push('Stunned')
      this.close()
    },
    applyDestroyed() {
      this.mech.Destroy()
      this.close()
    },
    applySystemTrauma() {
      if (this.systemTraumaRoll > 3) {
        this.loadout.Systems.find(x => x.ID === this.destroyedSystem).Destroy()
      } else {
        const m = this.loadout.AllMounts(
          this.pilot.has('CoreBonus', 'imparm'),
          this.pilot.has('CoreBonus', 'intweapon')
        )[this.destroyedMount]
        m.Weapons.forEach(w => {
          w.Destroy()
        })
      }
      this.close()
    },
  },
})
</script>

<style scoped>
.title-bg {
  background: repeating-linear-gradient(
    45deg,
    rgb(94, 72, 0),
    rgba(94, 72, 0) 20px,
    rgba(0, 0, 0) 20px,
    rgba(0, 0, 0) 40px
  );
}

.die-hover {
  opacity: 0.75;
  transform: all 0.3s;
}

.die-hover:hover {
  opacity: 1;
  background-color: #e3f2fd;
}
</style>
