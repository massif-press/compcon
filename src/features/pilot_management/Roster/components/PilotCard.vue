<template>
  <v-col cols="4">
    <v-hover>
      <template v-slot:default="{ hover }">
        <v-card
          class="card-outline"
          height="300px"
          tile
          flat
          @click="$router.push(`pilot/${pilot.ID}`)"
        >
          <div
            class="clipped-large"
            style="
              z-index: 2; position: absolute; top: 0; left: -2px; right: -2px; height: 32px; background-color: var(--v-primary-base)"
          >
            <span class="heading h2 white--text flavor-text ml-2" style="letter-spacing: 3px">
              {{ pilot.Callsign }}
            </span>
          </div>
          <div class="triangle" />
          <div class="ll">
            <div class="overline mb-n1 text-right">LL</div>
            <div class="heading h2 mt-n2">{{ pilot.Level }}</div>
          </div>
          <v-img :src="pilot.Portrait" position="top center" height="100%" />
          <v-fade-transition>
            <v-overlay v-if="hover" absolute color="grey darken-3" opacity="0.8">
              <v-card flat tile class="flavor-text" light>
                <v-card-text>
                  <b>{{ pilot.Name }}</b>
                  //
                  <b>{{ pilot.Callsign }} {{ pilot.Background }}</b>
                  <v-row dense>
                    <v-col cols="auto">
                      <span class="overline">HP</span>
                      <br />
                      <b>{{ pilot.CurrentHP }}</b>
                      <span class="subtle--text ml-n2">/{{ pilot.MaxHP }}</span>
                    </v-col>
                    <v-divider vertical class="mx-2" />
                    <v-col cols="auto">
                      <span class="overline">Armor</span>
                      <br />
                      <b>{{ pilot.Armor }}</b>
                    </v-col>
                    <v-divider vertical class="mx-2" />
                    <v-col cols="auto">
                      <span class="overline">E-Def</span>
                      <br />
                      <b>{{ pilot.EDefense }}</b>
                    </v-col>
                    <v-divider vertical class="mx-2" />
                    <v-col cols="auto">
                      <span class="overline">Evasion</span>
                      <br />
                      <b>{{ pilot.Evasion }}</b>
                    </v-col>
                    <v-divider vertical class="mx-2" />
                    <v-col cols="auto">
                      <span class="overline">Speed</span>
                      <br />
                      <b>{{ pilot.Speed }}</b>
                    </v-col>
                  </v-row>
                  <div v-if="pilot.ActiveMech">
                    <v-divider />
                    <div class="flavor-text anti--text mb-0">
                      {{ pilot.ActiveMech.Frame.Source }} {{ pilot.ActiveMech.Frame.Name }}
                    </div>
                    <b class="pl-2">
                      <cc-slashes />
                      {{ pilot.ActiveMech.Name }}
                    </b>
                  </div>
                </v-card-text>
              </v-card>
            </v-overlay>
          </v-fade-transition>
        </v-card>
      </template>
    </v-hover>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'pilot-card',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>

<style scoped>
.card-outline {
  border: 1px solid;
  border-color: var(--v-accent-base);
}

.triangle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 65px 65px;
  z-index: 2;
  border-color: transparent transparent var(--v-primary-base) transparent;
}

.ll {
  position: absolute;
  bottom: 0;
  right: 4px;
  /* width: 40px; */
  /* height: 40px; */
  z-index: 3;
}
</style>
