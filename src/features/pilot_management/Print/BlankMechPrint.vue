<template>
  <v-container fluid>
    <v-row dense align="start">
      <single cols="8" label="MECH NAME" height="60" />
      <v-spacer />
      <single cols="1" label="SIZE" height="60" />
      <v-col cols="2" class="mt-n1">
        <v-row dense>
          <single cols="6" label="HULL" height="20" />
          <single cols="6" label="AGI" height="20" />
        </v-row>
        <v-row dense class="mt-n2">
          <single cols="6" label="SYS" height="20" />
          <single cols="6" label="ENG" height="20" />
        </v-row>
      </v-col>
    </v-row>
    <v-row dense align="start" class="mt-n3">
      <single cols="2" label="MANUFACTURER" height="20" />
      <single cols="4" label="FRAME" height="20" />
      <single cols="2" label="STATUS" height="20" />
      <v-spacer />
      <single cols="3" label="PILOT" height="20" />
    </v-row>

    <v-row dense>
      <v-col>
        <div class="overline mb-n1">STRUCTURE</div>
        <v-row dense no-gutters align="center">
          <v-col cols="auto">
            <v-icon size="60" color="grey lighten-3" class="mr-n1">cci-structure</v-icon>
          </v-col>
          <v-col cols="auto" class="mt-6 mr-n2">
            <span class="subtle--text text--lighten-1 display-2" style="line-height: 0">/</span>
          </v-col>
          <v-col cols="auto" class="mb-n2">
            <v-icon size="50" color="grey lighten-3" class="mr-n1">mdi-hexagon-outline</v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto">
        <div class="overline mb-n1">ARMOR</div>
        <v-icon size="60" color="grey lighten-3">mdi-shield-outline</v-icon>
      </v-col>
      <v-col>
        <div class="overline mb-n1">HP</div>
        <v-row dense no-gutters align="center">
          <v-col cols="auto">
            <v-icon size="60" color="grey lighten-3" class="mr-n1">mdi-hexagon-outline</v-icon>
          </v-col>
          <v-col cols="auto" class="mt-6 mr-n2">
            <span class="subtle--text text--lighten-1 display-2" style="line-height: 0">/</span>
          </v-col>
          <v-col cols="auto" class="mb-n2">
            <v-icon size="50" color="grey lighten-3" class="mr-n1">mdi-hexagon-outline</v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <div class="overline mb-n1">REACTOR</div>
        <v-row dense no-gutters align="center">
          <v-col cols="auto">
            <v-icon size="60" color="grey lighten-3" class="mr-n1">cci-reactor</v-icon>
          </v-col>
          <v-col cols="auto" class="mt-6 mr-n2">
            <span class="subtle--text text--lighten-1 display-2" style="line-height: 0">/</span>
          </v-col>
          <v-col cols="auto" class="mb-n2">
            <v-icon size="50" color="grey lighten-3" class="mr-n1">mdi-hexagon-outline</v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <div class="overline mb-n1">HEAT</div>
        <v-row dense no-gutters align="center">
          <v-col cols="auto">
            <v-icon size="60" color="grey lighten-3" class="mr-n1">cci-burn</v-icon>
          </v-col>
          <v-col cols="auto" class="mt-6 mr-n2">
            <span class="subtle--text text--lighten-1 display-2" style="line-height: 0">/</span>
          </v-col>
          <v-col cols="auto" class="mb-n2">
            <v-icon size="50" color="grey lighten-3" class="mr-n1">mdi-hexagon-outline</v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <div class="overline mb-n1">REPAIR CAPACITY</div>
        <v-row dense no-gutters align="center">
          <v-col cols="auto">
            <v-icon size="60" color="grey lighten-3" class="mr-n1">cci-repair</v-icon>
          </v-col>
          <v-col cols="auto" class="mt-6 mr-n2">
            <span class="subtle--text text--lighten-1 display-2" style="line-height: 0">/</span>
          </v-col>
          <v-col cols="auto" class="mb-n2">
            <v-icon size="50" color="grey lighten-3" class="mr-n1">mdi-hexagon-outline</v-icon>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <div class="overline mb-n1 mt-n1">OVERCHARGE</div>
    <v-row no-gutters class="text-center" justify="space-around">
      <v-col cols="auto" class="grey lighten-3 mx-2 oc-border">
        +1
        <v-icon small>mdi-fire</v-icon>
      </v-col>
      <v-col cols="auto" class="grey lighten-3 mx-2 oc-border">
        +1d3
        <v-icon small>mdi-fire</v-icon>
      </v-col>
      <v-col cols="auto" class="grey lighten-3 mx-2 oc-border">
        +1d6
        <v-icon small>mdi-fire</v-icon>
      </v-col>
      <v-col cols="auto" class="grey lighten-3 mx-2 oc-border">
        +1d6+4
        <v-icon small>mdi-fire</v-icon>
      </v-col>
    </v-row>
    <v-row align="start" class="mt-n2">
      <single cols="2" label="ATK BONUS" height="40" />
      <single cols="2" label="TECH ATK" height="40" />
      <single cols="2" label="SAVE" height="40" />
      <single cols="2" label="SPEED" height="40" />
      <single cols="2" label="E-DEFENSE" height="40" />
      <single cols="2" label="EVASION" height="40" />
    </v-row>

    <v-divider />
    <span class="overline">FRAME TRAITS</span>
    <v-row v-for="n in 3" :key="`trait${n}`" dense class="mt-n2">
      <single cols="7" label="TRAIT" height="20" />
      <single cols="12" label="EFFECT" height="75" class="mt-n2" />
    </v-row>

    <v-divider />
    <span class="overline">CORE SYSTEM</span>
    <v-row dense class="mt-n2">
      <single cols="7" label="CORE POWER" height="20" />
      <v-spacer />
      <single cols="1" label="USED" height="20" />
      <single cols="12" label="PASSIVE ABILITY" height="50" class="mt-n2" />
      <single cols="12" label="ACTIVE ABILITY" height="100" class="mt-n2" />
    </v-row>

    <div style="page-break-before: always;" />

    <span class="overline">ARMAMENT</span>
    <v-row v-for="n in 2" :key="`mr_${n}`">
      <v-col v-for="x in 2" :key="`mc_${n}_${x}`">
        <fieldset>
          <legend>
            <div
              class="d-inline-block text-right"
              style="height: 35px; min-width: 300px; border: 2px solid grey; border-radius: 3px"
            >
              <span class="d-inline-block flavor-text" style="font-size:20px">
                MOUNT&nbsp;
              </span>
            </div>
          </legend>
          <v-row v-for="y in 2" :key="`mc_${n}_${x}_${y}`" dense class="mt-n1">
            <single cols="9" label="WEAPON" height="20" />
            <single cols="3" label="TYPE" height="20" />
            <single cols="6" label="DAMAGE" height="20" class="mt-n2" />
            <single cols="6" label="RANGE" height="20" class="mt-n2" />
            <single cols="12" label="EFFECT" height="50" class="mt-n2" />
            <v-col v-if="y === 1" cols="12">
              <v-divider class="my-1" />
            </v-col>
          </v-row>
        </fieldset>
      </v-col>
    </v-row>
    <v-divider class="my-1" />
    <span class="overline">SYSTEMS</span>
    <v-row v-for="n in 5" :key="`ms_${n}`" dense class="mt-n3">
      <v-col v-for="x in 2" :key="`ms_${n}_${x}`" cols="6">
        <v-row dense>
          <single cols="10" label="SYSTEM" height="20" />
          <single cols="2" label="SP" height="20" />
          <single cols="12" label="EFFECT" height="150" class="mt-n2" />
        </v-row>
      </v-col>
    </v-row>
    <v-row dense>
      <single cols="1" label="USED SP" height="20" class="ml-auto mt-n3" />
      <single cols="1" label="MAX SP" height="20" class="mt-n3" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Single from './blanks/Single.vue'

export default Vue.extend({
  name: 'mech-blank-view',
  components: { Single },
})
</script>

<style scoped>
.no-height {
  line-height: 0;
}

.icon-overlap {
  position: absolute;
  top: -5px;
  left: 1px;
  width: -webkit-fill-available;
  text-align: center;
}

.p-stat {
  font-size: 34px;
}

fieldset {
  padding: 0 4px;
  height: 100%;
  border-radius: 3px;
  border-color: var(--v-grey-lighten2);
}
</style>
