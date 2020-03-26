<template>
  <v-dialog v-model="dialog" width="60vw" persistent>
    <v-card flat tile>
      <v-toolbar color="title-bg clipped-large" dark flat>
        <v-toolbar-title class="heading h1">OVERHEATING</v-toolbar-title>
      </v-toolbar>
      <v-window v-model="window">
        <v-window-item>
          <v-card-text class="text-center">
            <span class="flavor-text">
              <v-alert prominent dark dense icon="cci-reactor" color="error" border="left" tile>
                <b class="heading h2">REACTOR STRESS CRITICAL</b>
              </v-alert>
              Roll 1d6 per point of reactor stress
            </span>
            <br />
            <span class="overline">
              <b>{{ totalRolls - rolls.length }}</b>
              rolls remaining
            </span>
            <br />
            <div v-for="n in rolls.length" :key="`rr${n}`" class="d-inline">
              <cc-tooltip simple inline content="Click to re-roll">
                <v-btn icon @click="rolls.splice(n - 1, 1)">
                  <v-icon
                    x-large
                    :color="rolls[n - 1] === 1 ? 'error' : 'black'"
                    v-html="`mdi-dice-${rolls[n - 1]}`"
                  />
                </v-btn>
              </cc-tooltip>
            </div>
            <div v-for="n in totalRolls - rolls.length" :key="`er${n}`" class="d-inline">
              <v-btn icon x-large disabled>
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
                    // REACTOR INTEGRITY FAILING //
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
            <v-btn color="warning" @click="dialog = false">dismiss</v-btn>
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
        <table-window-item
          :title="resultData[0].name"
          :content="resultData[0].description"
          @dismiss="close()"
          @previous="window = 0"
          @confirm="applyES()"
        />
        <table-window-item
          :title="resultData[1].name"
          :content="resultData[1].description"
          @dismiss="close()"
          @previous="window = 0"
          @confirm="applyPPD()"
        />
        <table-window-item
          :title="resultData[2].name"
          other-btn
          @dismiss="close()"
          @previous="window = 0"
          @confirm="applyPPD()"
        >
          <p
            v-html="
              mech.CurrentStructure >= 3
                ? 'Your mech is <b>exposed</b> until you take action to remove the condition.'
                : 'Your mech must pass a engineering check or suffer a reactor meltdown at the end of 1d6 turns after this one (rolled by the GM). You can reverse it by taking a full action and repeating this check. Even on a successful check, your mech suffers from the <b>exposed</b> condition until you take action to remove it.'
            "
          />
          <div slot="confirm-button">
            <div v-if="mech.CurrentStructure >= 3">
              <v-btn color="success" large @click="applyPPD()">confirm</v-btn>
            </div>
            <div v-else>
              <v-btn color="error" large @click="window = 4">fail check</v-btn>
              <v-btn color="success" large @click="applyPPD">succeed check</v-btn>
            </div>
          </div>
        </table-window-item>

        <table-window-item
          :title="resultData[3].name"
          :content="resultData[3].description"
          :hide-previous="mech.CurrentStress <= 1"
          @dismiss="close()"
          @previous="window = 0"
          @confirm="applyMeltdown()"
        />
      </v-window>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import TableWindowItem from './_TableWindowItem.vue'
import ResultData from './_stress_results.json'
import { Mech } from '@/class'

@Component({
  name: 'stress-table',
  components: { TableWindowItem },
})
export default class CCStressTable extends Vue {
  dialog = false
  show(): void {
    this.dialog = true
    if (this.mech.CurrentStress === 0) this.window = 4
  }
  close(): void {
    this.window = 0
    this.rolls = []
    this.dialog = false
  }
  window = 0

  @Prop({ type: Object, required: true })
  mech!: Mech

  rolls = []
  resultData = ResultData
  results = [
    'Meltdown',
    'Power Plant Destabilize',
    'Power Plant Destabilize',
    'Power Plant Destabilize',
    'Emergency Shunt',
    'Emergency Shunt',
  ]

  get totalRolls(): number {
    return (this.mech.CurrentStress - this.mech.MaxStress) * -1
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
        return 2
      case 1:
        return 3
    }
    return 4
  }

  applyES(): void {
    if (!this.mech.Conditions.includes('Impaired')) this.mech.Conditions.push('Impaired')
    this.close()
  }
  applyPPD(): void {
    if (!this.mech.Statuses.includes('Exposed')) this.mech.Statuses.push('Exposed')
    this.close()
  }
  applyMeltdown(): void {
    this.mech.MeltdownImminent = true
    this.close()
  }
}
</script>

<style scoped>
.title-bg {
  background: repeating-linear-gradient(
    45deg,
    rgb(124, 0, 0),
    rgba(124, 0, 0) 20px,
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
