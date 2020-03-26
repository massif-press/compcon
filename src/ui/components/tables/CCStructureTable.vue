<template>
  <v-dialog v-model="dialog" width="60vw" persistent>
    <v-card flat tile>
      <v-toolbar color="title-bg clipped-large" dark flat>
        <v-toolbar-title class="heading h1">STRUCTURE DAMAGE</v-toolbar-title>
      </v-toolbar>
      <v-window v-model="window">
        <v-window-item>
          <v-card-text class="text-center">
            <span class="flavor-text">
              <v-alert prominent dark dense icon="cci-structure" color="error" border="left" tile>
                <b class="heading h2">FRAME INTEGRITY COMPROMISED</b>
              </v-alert>
              Roll 1d6 per point of structure damage
            </span>
            <br />
            <span class="overline">
              <b>{{ totalRolls - rolls.length }}</b>
              rolls remaining
            </span>
            <br />
            <div v-for="n in rolls.length" :key="`rr${n}`" class="d-inline">
              <cc-tooltip simple inline content="Click to re-roll">
                <v-btn text icon @click="rolls.splice(n - 1, 1)">
                  <v-icon
                    x-large
                    :color="rolls[n - 1] === 1 ? 'error' : ''"
                    v-html="`mdi-dice-${rolls[n - 1]}`"
                  />
                </v-btn>
              </cc-tooltip>
            </div>
            <div v-for="n in totalRolls - rolls.length" :key="`er${n}`" class="d-inline">
              <v-btn text icon x-large disabled>
                <v-icon x-large v-html="'mdi-checkbox-blank-outline'" />
              </v-btn>
            </div>
            <br />
            <v-scroll-y-transition group leave-absolute>
              <div v-if="rolls.length < totalRolls" key="tr01" class="d-inline">
                <v-btn
                  v-for="n in 6"
                  :key="`rb${n}`"
                  class="mt-0 mb-4"
                  :ripple="false"
                  x-large
                  color="primary"
                  icon
                  @click="rolls.push(n)"
                >
                  <v-icon class="die-hover" size="55px" v-html="`mdi-dice-${n}`" />
                </v-btn>
              </div>
              <div v-else key="tr02">
                <v-scroll-y-transition group>
                  <span
                    v-if="rolls.filter(x => x === 1).length > 1"
                    key="t01"
                    class="heading h3 error--text"
                  >
                    // CRITICAL STRUCTURAL DAMAGE //
                  </span>
                  <span v-else-if="rolls.length" key="t02" class="heading h3">
                    <b>{{ results[Math.min(...rolls) - 1] }}</b>
                    <i class="overline">({{ Math.min(...rolls) }})</i>
                  </span>
                </v-scroll-y-transition>
              </div>
            </v-scroll-y-transition>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn text small @click="dialog = false">dismiss</v-btn>
            <v-spacer />
            <v-btn
              color="primary"
              large
              tile
              :disabled="totalRolls - rolls.length > 0"
              @click="window = resultWindow"
            >
              continue
            </v-btn>
          </v-card-actions>
        </v-window-item>
        <table-window-item
          :title="resultData[0].name"
          :content="resultData[0].description"
          @dismiss="$emit('dismiss')"
          @previous="window = 0"
          @confirm="applyGlancingBlow()"
        />
        <table-window-item
          :title="resultData[1].name"
          :disabled="
            (systemTraumaRoll <= 3 && destroyedMount === null) ||
              (systemTraumaRoll > 3 && !destroyedSystem)
          "
          @dismiss="$emit('dismiss')"
          @previous="window = 0"
          @confirm="applySystemTrauma()"
        >
          <p class="fluff-text">
            Parts of your mech have been torn off by the damage. Roll a d6.
          </p>
          <v-btn
            v-for="n in 6"
            :key="`rb${n}`"
            class="mt-0 mb-4"
            :ripple="false"
            x-large
            :color="systemTraumaRoll === n ? 'error' : 'primary'"
            icon
            @click="systemTraumaRoll = n"
          >
            <v-icon class="die-hover" size="55px" v-html="`mdi-dice-${n}`" />
          </v-btn>
          <div v-if="systemTraumaRoll && systemTraumaRoll <= 3">
            <v-select
              v-model="destroyedMount"
              style="margin-left: 30%; margin-right: 30%"
              label="Mounts"
              :items="destroyableMounts"
              item-text="name"
              item-value="index"
            />
            <span class="effect-text">All weapons on this mount are destroyed</span>
          </div>
          <div v-else-if="systemTraumaRoll && systemTraumaRoll >= 4">
            <v-select
              v-model="destroyedSystem"
              style="margin-left: 30%; margin-right: 30%"
              label="Systems"
              :items="destroyableSystems"
              item-text="Name"
              item-value="ID"
            />
            <span class="effect-text">This system is destroyed</span>
          </div>
        </table-window-item>
        <table-window-item
          :title="resultData[2].name"
          other-btn
          @dismiss="$emit('dismiss')"
          @previous="window = 0"
        >
          <p
            v-html="
              mech.CurrentStructure >= 3
                ? 'Your mech is <b>stunned</b> until the end of your next turn.'
                : 'Your mech must pass a <b>hull</b> check or be <b>destroyed</b>. Even on a successful check, your mech is <b>stunned</b> until the end of your next turn.'
            "
          />
          <div slot="confirm-button">
            <div v-if="mech.CurrentStructure >= 3">
              <v-btn color="success" large @click="applyDirectHit">confirm</v-btn>
            </div>
            <div v-else>
              <v-btn color="error" tile large @click="window = 4">fail hull check</v-btn>
              <v-btn color="success darken-1" tile large @click="applyDirectHit()">
                pass hull check
              </v-btn>
            </div>
          </div>
        </table-window-item>
        <table-window-item
          :title="resultData[3].name"
          :content="resultData[3].description"
          @dismiss="$emit('dismiss')"
          @previous="window = 0"
          @confirm="applyDestroyed()"
        />
      </v-window>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import TableWindowItem from './_TableWindowItem.vue'
import ResultData from './_structure_results.json'
import { Mech, MechLoadout, MechSystem } from '@/class'

@Component({
  name: 'structure-table',
  components: { TableWindowItem },
})
export default class CCSidebarView extends Vue {
  dialog = false
  show(): void {
    this.dialog = true
  }
  close(): void {
    this.window = 0
    this.rolls = []
    this.systemTraumaRoll = null
    this.destroyedSystem = null
    this.destroyedMount = null
    this.dialog = false
  }
  window = 0

  @Prop({ type: Object, required: true })
  mech!: Mech

  rolls = []
  resultData = ResultData
  systemTraumaRoll = null
  destroyedSystem = null
  destroyedMount = null
  results = [
    'Direct Hit',
    'System Trauma',
    'System Trauma',
    'System Trauma',
    'Glancing Blow',
    'Glancing Blow',
  ]

  get loadout(): MechLoadout {
    return this.mech.ActiveLoadout
  }
  get totalRolls(): number {
    return (this.mech.CurrentStructure - this.mech.MaxStructure) * -1
  }
  get resultWindow(): number {
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
  }

  get destroyableMounts(): { name: string; index: number }[] {
    return this.loadout
      .AllMounts(
        this.mech.Pilot.has('CoreBonus', 'cb_improved_armament'),
        this.mech.Pilot.has('CoreBonus', 'cb_integrated_weapon')
      )
      .filter(x => x.Weapons.some(w => !w.Destroyed && !(w.IsLimited && w.Uses === 0)))
      .map((m, i) => ({ name: m.Name, index: i }))
  }

  get destroyableSystems(): MechSystem[] {
    return this.loadout.Systems.filter(
      x => !x.IsIndestructible && !x.Destroyed && !(x.IsLimited && x.Uses === 0)
    )
  }

  applyGlancingBlow(): void {
    if (!this.mech.Conditions.includes('Impaired')) this.mech.Conditions.push('Impaired')
    this.close()
  }

  applyDirectHit(): void {
    if (!this.mech.Conditions.includes('Stunned')) this.mech.Conditions.push('Stunned')
    this.close()
  }

  applyDestroyed(): void {
    this.mech.Destroy()
    this.close()
  }

  applySystemTrauma(): void {
    if (this.systemTraumaRoll > 3) {
      this.loadout.Systems.find(x => x.ID === this.destroyedSystem).Destroy()
    } else {
      const m = this.loadout.AllMounts(
        this.mech.Pilot.has('CoreBonus', 'cb_improved_armament'),
        this.mech.Pilot.has('CoreBonus', 'cb_integrated_weapon')
      )[this.destroyedMount]
      m.Weapons.forEach(w => {
        w.Destroy()
      })
    }
    this.close()
  }
}
</script>

<style scoped>
.title-bg {
  background: repeating-linear-gradient(
    45deg,
    rgb(94, 72, 0),
    rgba(94, 72, 0) 20px,
    rgba(30, 30, 30) 20px,
    rgba(30, 30, 30) 40px
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
