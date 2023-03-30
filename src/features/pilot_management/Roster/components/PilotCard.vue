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
            }; background-color: rgb(var(--v-theme-primary)); transition: opacity 0.2s;`"
          >
            <div
              :class="`heading ${
                small || mobile ? 'h3' : 'h2'
              } text-white flavor-text ml-2`"
              style="letter-spacing: 3px; text-overflow: ellipsis"
            >
              {{ pilot.Callsign }}
            </div>
          </div>
          <div
            v-show="!(small && mobile)"
            :class="small ? 'small-triangle' : 'triangle'"
          />
          <div
            v-show="!(small && mobile)"
            class="ll text-white"
            style="line-height: 25px"
          >
            <div v-if="!small" class="text-overline mb-n1 text-right">LL</div>
            <div :class="`heading ${small ? 'h3' : 'h2'} mt-n2`">
              {{ pilot.Level.toString().padStart(2, '0') }}
            </div>
          </div>
          <v-img
            :src="pilot.Portrait"
            position="top center"
            height="100%"
            :aspect-ratio="1"
          />
          <v-fade-transition>
            <v-overlay
              v-if="hover && !small"
              absolute
              color="grey darken-3"
              opacity="0.8"
              style="pointer-events: none"
            >
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
                  HULL {{ pilot.MechSkillsController.MechSkills.Hull }} - AGI
                  {{ pilot.MechSkillsController.MechSkills.Agi }} - SYS
                  {{ pilot.MechSkillsController.MechSkills.Sys }} - ENG
                  {{ pilot.MechSkillsController.MechSkills.Eng }}
                  <v-divider />
                  <div>
                    <span v-for="(s, i) in pilot.TalentsController.Talents">
                      {{ s.Talent.Name }} {{ 'I'.repeat(s.Rank) }}
                      {{
                        i + 1 !== pilot.TalentsController.Talents.length
                          ? '-'
                          : ''
                      }}
                    </span>
                  </div>
                  <v-divider />
                  <div>
                    <span
                      v-for="(b, i) in pilot.CoreBonusController.CoreBonuses"
                    >
                      {{ b.Name }}
                      {{
                        i + 1 !== pilot.CoreBonusController.CoreBonuses.length
                          ? '-'
                          : ''
                      }}
                    </span>
                  </div>
                  <div v-if="pilot.ActiveMech">
                    <v-divider class="my-2 mb-1" />
                    <div class="flavor-text mb-0">
                      {{ pilot.ActiveMech.Frame.Source }}
                      {{ pilot.ActiveMech.Frame.Name }}
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
export default {
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
      return this.$vuetify.display.smAndDown;
    },
    minWidth() {
      if (this.mobile) {
        return this.small ? '18vw' : '40vw';
      }
      return this.small ? '10vw' : '20vw';
    },
  },
  methods: {
    toPilotSheet() {
      this.$router.push(`pilot/${this.pilot.ID}`);
    },
  },
};
</script>

<style scoped>
.card-outline {
  border: 1px solid;
  border-color: rgb(var(--v-theme-accent));
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
  border-color: transparent transparent rgb(var(--v-theme-primary)) transparent;
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
  border-color: transparent transparent rgb(var(--v-theme-primary)) transparent;
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
