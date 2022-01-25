<template>
  <div class="d-inline-flex ma-2" :style="`min-width: ${minWidth};`">
    <v-hover :style="`min-width: ${minWidth}`">
      <template v-slot:default="{ hover }">
        <v-card
          class="card-outline"
          :min-height="minWidth"
          :min-width="minWidth"
          tile
          flat
          @click="!dragging ? toPilotSheet() : null"
        >
          <div
            v-show="!(small && mobile)"
            class="clipped-large"
            :style="`
              z-index: 2; position: absolute; top: 0; left: -2px; right: -2px; height: ${
              small || mobile ? '25' : '32'
            }px; ${
              small && hover ? 'opacity: 1' : 'opacity: 0.6'
            }; background-color: var(--v-primary-base); transition: opacity 0.2s;`"
          >
            <div
              :class="`heading ${small || mobile ? 'h3' : 'h2'} white--text flavor-text ml-2`"
              style="letter-spacing: 3px; text-overflow: ellipsis"
            >
              {{ pilot.Callsign }}
              <v-icon v-if="!pilot.IsLocallyOwned" right dark>mdi-cloud-check-outline</v-icon>
            </div>
          </div>
          <div v-show="!(small && mobile)" :class="small ? 'small-triangle' : 'triangle'" />
          <div v-show="!(small && mobile)" class="ll white--text" style="line-height: 25px">
            <div v-if="!small" class="overline mb-n1 text-right">LL</div>
            <div :class="`heading ${small ? 'h3' : 'h2'} mt-n2`">
              {{ pilot.Level.toString().padStart(2, '0') }}
            </div>
          </div>
          <v-img :src="pilot.Portrait" position="top center" height="100%" :aspect-ratio="1" />
          <v-fade-transition>
            <v-overlay v-if="hover && !small" absolute color="grey darken-3" opacity="0.8" style="pointer-events: none">
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
                    <v-divider class="my-2 mb-1" />
                    <div class="flavor-text mb-0">
                      {{ pilot.ActiveMech.Frame.Source }} {{ pilot.ActiveMech.Frame.Name }}
                    </div>
                    <b class="pl-2">
                      <cc-slashes />
                      {{ pilot.ActiveMech.Name }}
                    </b>
                  </div>
                  <div v-if="!pilot.IsLocallyOwned" class="caption">
                    <v-divider class="mt-2 mb-1" />
                    <v-icon small>mdi-cloud-check-outline</v-icon>
                    This pilot is registered to another user
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
    dragging: {
      type: Boolean,
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
    minWidth() {
      if (this.mobile) {
        return this.small ? '18vw' : '40vw'
      }
      return this.small ? '10vw' : '20vw'
    },
  },
  methods: {
    toPilotSheet() {
      this.$router.push(`pilot/${this.pilot.ID}`)
    },
  }
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
