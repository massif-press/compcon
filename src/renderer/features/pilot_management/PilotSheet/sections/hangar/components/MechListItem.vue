<template>
  <div id="pc-wrapper" @click="emit('go', mech)">
    <v-card
      tile
      :color="mech.Frame.Manufacturer.Color"
      style="position: absolute; z-index:5"
      class="overlay clipped-square-invert"
      min-width="150px"
      min-height="150px"
    >
      <div id="interior" class="clipped-square-invert">
        <v-img :src="mech.Portrait" position="top center" height="150px" />
      </div>
    </v-card>
    <div id="banner" style="width: 100%">
      <div
        style="width: 100%"
        class="overlay sliced"
        :style="`background-color: ${mech.Frame.Manufacturer.Color}`"
      >
        <v-row no-gutters>
          <span class="heading h2 callsign" style="margin-left: 150px;">{{ mech.Name }}</span>
          <v-fade-transition>
            <span
              v-if="mech.IsActive"
              class="heading h2 callsign ml-auto pr-10"
            >/ / ACTIVE / /&nbsp;</span>
          </v-fade-transition>
        </v-row>
      </div>
      <div style="margin-right: 30px; border-top: 0!important" class="panel-block">
        <div style="margin-left: 150px; padding-left: 8px; min-height: 100px">
          <p class="flavor-text mb-0">
            <v-row no-gutters justify="right">
              <v-col cols="auto">
                <b>{{ mech.Name }}</b> //
                <b>{{ mech.Frame.Source }} {{ mech.Frame.Name }}</b>
                <br />
                <!-- TODO: prevent null activeloadout -->
                Equipped Loadout: {{ mech.ActiveLoadout ? mech.ActiveLoadout.Name : 'ERR' }}
              </v-col>
              <v-col cols="auto" class="ml-auto mr-4">
                <div style="margin-right: 36px">
                  <cc-tooltip v-if="!mech.IsActive" simple content="Set as Active">
                    <v-icon
                      size="50"
                      class="fadeSelect"
                      @click.stop="$emit('set-active', mech)"
                    >cci-activate</v-icon>
                  </cc-tooltip>
                  <v-icon v-else size="50" color="success">cci-activate</v-icon>
                </div>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="auto">
                <span class="overline">STR</span>
                <br />
                <b>{{ mech.CurrentStructure }}</b>
                <span class="grey--text ml-n2">/{{ mech.MaxStructure }}</span>
              </v-col>
              <v-divider vertical class="mx-2" />
              <v-col cols="auto">
                <span class="overline">HP</span>
                <br />
                <b>{{ mech.CurrentHP }}</b>
                <span class="grey--text ml-n2">/{{ mech.MaxHP }}</span>
              </v-col>
              <v-divider vertical class="mx-2" />
              <v-col cols="auto">
                <span class="overline">Stress</span>
                <br />
                <b>{{ mech.CurrentStress }}</b>
                <span class="grey--text ml-n2">/{{ mech.MaxStress }}</span>
              </v-col>
              <v-divider vertical class="mx-2" />
              <v-col cols="auto">
                <span class="overline">Heat</span>
                <br />
                <b>{{ mech.CurrentHeat }}</b>
                <span class="grey--text ml-n2">/{{ mech.HeatCapacity }}</span>
              </v-col>
              <v-divider vertical class="mx-2" />
              <v-col cols="auto">
                <span class="overline">RepCap</span>
                <br />
                <b>{{ mech.CurrentRepairs }}</b>
                <span class="grey--text ml-n2">/{{ mech.RepairCapacity }}</span>
              </v-col>
              <v-col cols="auto" class="white--text flavor-text">
                <v-alert v-if="mech.IsDestroyed" color="error" dense tile class="text-center">
                  <span style="letter-spacing: 5px">// DESTROYED //</span>
                </v-alert>
                <v-alert v-if="mech.MeltdownImminent" color="orange" dense tile class="text-center">
                  <span style="letter-spacing: 5px">// REACTOR CRITICAL //</span>
                </v-alert>
                <v-alert v-if="mech.ReactorDestroyed" color="accent" dense tile class="text-center">
                  <span style="letter-spacing: 5px">// REACTOR DESTROYED //</span>
                </v-alert>
              </v-col>
              <v-col cols="auto" class="ml-auto mr-4">
                <mech-ops
                  :mech="mech"
                  @delete="$emit('delete-mech', mech)"
                  @dupe="$emit('dupe-mech', mech)"
                />
              </v-col>
            </v-row>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MechOps from './MechOps.vue'

export default Vue.extend({
  name: 'mech-list-item',
  components: { MechOps },
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
})
</script>

<style scoped>
#pc-wrapper {
  position: relative;
  min-height: 150px;
  min-width: 100%;
  cursor: pointer;
  margin-bottom: 12px;
}

.callsign {
  color: white;
  max-height: 32px;
  min-height: 32px;
  line-height: 28px;
}

#interior {
  position: absolute;
  top: 2px;
  left: 2px;
  bottom: 2px;
  right: 2px;
  background-color: var(--v-panel-base);
}

.overlay {
  filter: brightness(70%);
  transition: filter 0.3s ease-in-out;
}

#pc-wrapper:hover .overlay {
  filter: brightness(100%);
}
</style>