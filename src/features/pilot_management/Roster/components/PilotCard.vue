<template>
  <div class="d-inline-flex ma-2" :style="`width: ${minWidth};`">
    <v-hover>
      <template v-slot="{ isHovering, props }">
        <v-card
          :class="missingContent ? 'card-missing-outline' : 'card-outline'"
          :min-height="minWidth"
          :min-width="minWidth"
          tile
          flat
          v-bind="props"
          :style="missingContent ? 'cursor: not-allowed' : ''"
          @click="!missingContent ? toPilotSheet() : null">
          <div
            v-show="!small"
            class="clipped-large"
            :class="missingContent ? 'background-missing' : 'background-standard'"
            :style="`
              z-index: 2; position: absolute; top: 0; left: -2px; right: -2px; height: ${
                small ? '25' : '32'
              }px; ${
                small && isHovering ? 'opacity: 1' : 'opacity: 0.6'
              }; transition: opacity 0.2s;`">
            <div
              :class="`heading ${small ? 'h3' : 'h2'} text-white flavor-text ml-2 mt-1`"
              style="letter-spacing: 3px; text-overflow: ellipsis">
              {{ pilot.Callsign }}
            </div>
          </div>
          <div v-show="!small" :class="small ? 'small-triangle' : 'triangle'" />
          <div v-show="!small" class="ll text-white" style="line-height: 25px">
            <div v-if="!small" class="text-overline mb-n1 text-right">LL</div>
            <div :class="`heading ${small ? 'h3' : 'h2'} mt-n2`">
              {{ pilot.Level.toString().padStart(2, '0') }}
            </div>
          </div>
          <div style="position: relative">
            <cc-img
              :src="pilot.Portrait"
              position="top center"
              height="100%"
              :aspect-ratio="1"
              cover>
              <v-expand-transition>
                <div
                  v-if="isHovering && !small"
                  class="flavor-text bg-grey-darken-3 pa-3"
                  style="height: 100%; max-width: 100%; opacity: 0.85">
                  <br />
                  {{ pilot.Name }}
                  <br />
                  <b>{{ pilot.Callsign }}</b>
                  <cc-slashes />
                  <b>{{ pilot.Status }}</b>
                  <v-divider />
                  HULL {{ pilot.MechSkillsController.MechSkills.Hull }} AGI
                  {{ pilot.MechSkillsController.MechSkills.Agi }} SYS
                  {{ pilot.MechSkillsController.MechSkills.Sys }} ENG
                  {{ pilot.MechSkillsController.MechSkills.Eng }}
                  <v-divider />
                  <div v-if="missingContent">
                    <v-icon color="error">mdi-alert-rhombus</v-icon>
                    <b>ERR: Missing Content</b>
                    <br />
                    COMP/CON is unable to load this pilot due to one or more missing Content Packs.
                  </div>
                  <div v-else>
                    <div v-for="s in pilot.TalentsController.Talents">
                      {{ s.Talent.Name }} {{ 'I'.repeat(s.Rank) }}
                    </div>
                    <v-divider />
                    <div v-for="b in pilot.CoreBonusController.CoreBonuses">
                      {{ b.Name }}
                    </div>
                  </div>
                </div>
              </v-expand-transition>
            </cc-img>
            <div style="position: absolute; bottom: 2px; left: 2px">
              <cc-brew-info :controller="pilot.BrewController" />
            </div>
          </div>
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
  },
  emits: ['goTo'],
  computed: {
    missingContent() {
      return this.pilot.BrewController.MissingContent;
    },
    minWidth() {
      return this.small ? '10vw' : '20vw';
    },
  },
  methods: {
    toPilotSheet() {
      this.$emit('goTo', this.pilot.ID);
    },
  },
};
</script>

<style scoped>
.card-outline {
  border: 1px solid;
  border-color: rgb(var(--v-theme-accent));
}

.card-missing-outline {
  border: 1px solid;
  border-color: rgb(var(--v-theme-error));
}

.background-standard {
  background-color: rgb(var(--v-theme-primary));
}

.background-missing {
  background-color: rgb(var(--v-theme-error));
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
