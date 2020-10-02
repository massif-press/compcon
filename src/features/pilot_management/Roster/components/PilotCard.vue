<template>
  <div class="d-inline-flex ma-2" :style="small ? 'min-width: 10vw' : 'min-width: 25vw'">
    <v-hover :style="small ? 'min-width: 10vw' : 'min-width: 25vw'">
      <template v-slot:default="{ hover }">
        <v-card
          class="card-outline"
          :min-height="small ? '10vw' : '25vw'"
          :min-width="small ? '10vw' : '25vw'"
          tile
          flat
          @click="$router.push(`pilot/${pilot.ID}`)"
        >
          <div
            class="clipped-large"
            :style="
              `
              z-index: 2; position: absolute; top: 0; left: -2px; right: -2px; height: ${
                small ? '25' : '32'
              }px; ${
                small && hover ? 'opacity: 1' : 'opacity: 0.6'
              }; background-color: var(--v-primary-base); transition: opacity 0.2s;`
            "
          >
            <div
              :class="`heading ${small ? 'h3' : 'h2'} white--text flavor-text ml-2`"
              style="letter-spacing: 3px; text-overflow: ellipsis;"
            >
              {{ pilot.Callsign }}
            </div>
          </div>
          <div :class="small ? 'small-triangle' : 'triangle'" />
          <div class="ll white--text" style="line-height: 25px">
            <div v-if="!small" class="overline mb-n1 text-right">LL</div>
            <div :class="`heading ${small ? 'h3' : 'h2'} mt-n2`">
              {{ pilot.Level.toString().padStart(2, '0') }}
            </div>
          </div>
          <v-img :src="pilot.Portrait" position="top center" height="100%" :aspect-ratio="1" />
          <v-fade-transition>
            <v-overlay v-if="hover && !small" absolute color="grey darken-3" opacity="0.8">
              <v-card flat tile class="flavor-text" light>
                <v-card-text>
                  {{ pilot.Name }}
                  <br />
                  <b>{{ pilot.Callsign }}</b>
                  <cc-slashes />
                  <b>{{ pilot.Background }}</b>
                  <cc-slashes />
                  <b>{{ pilot.Status }}</b>
                  <v-divider />
                  HULL {{ pilot.MechSkills.Hull }} - AGI {{ pilot.MechSkills.Agi }} - SYS
                  {{ pilot.MechSkills.Sys }} - ENG
                  {{ pilot.MechSkills.Eng }}
                  <v-divider />
                  <div>
                    <span v-for="(s, i) in pilot.Talents" :key="pilot.ID + s.Talent.Name">
                      {{ s.Talent.Name }} {{ 'I'.repeat(s.Rank) }}
                      {{ i + 1 !== pilot.Talents.length ? '-' : '' }}
                    </span>
                  </div>
                  <v-divider />
                  <div>
                    <span v-for="(b, i) in pilot.CoreBonuses" :key="pilot.ID + b.Name">
                      {{ b.Name }} {{ i + 1 !== pilot.CoreBonuses.length ? '-' : '' }}
                    </span>
                  </div>
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
  </div>
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
    small: {
      type: Boolean,
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

.small-triangle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 45px 45px;
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
