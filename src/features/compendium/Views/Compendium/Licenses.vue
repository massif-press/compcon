<template>
  <v-container px-5>
    <h1 class="heading">LICENSES</h1>
    <v-row v-for="m in Object.keys(licenses)">
      <v-col v-if="!!manufacturer(m)" class="text-center pa-3">
        <v-row align="center" justify="center">
          <v-col cols="auto">
            <cc-logo
              v-if="manufacturer(m).LogoIsExternal"
              :source="manufacturer(m)"
              :size="$vuetify.display.mdAndDown ? 'large' : 'xLarge'"
              class="pt-3 mb-n1"
            />
            <v-icon
              v-else
              size="60"
              :icon="`cc:${manufacturer(m).Icon}`"
              :color="manufacturer(m).GetColor($vuetify.theme.current.dark)"
            />
          </v-col>
          <v-col
            cols="auto"
            :class="$vuetify.display.mdAndDown ? 'heading h2' : 'heading mech'"
            :style="`color: ${manufacturer(m).GetColor(
              $vuetify.theme.current.dark
            )}`"
          >
            {{ manufacturer(m).Name }}
          </v-col>
        </v-row>
        <v-expansion-panels accordion focusable active-class="border-primary">
          <v-expansion-panel
            v-for="l in licenses[m]"
            class="panel border-highlight"
          >
            <v-expansion-panel-title class="hover-parent" hide-actions>
              <div>
                <div>
                  <div class="caption">{{ frame(l.FrameID).Source }}</div>
                  <div class="heading h2 font-weight-bold">
                    {{ frame(l.FrameID).Name }}
                  </div>
                </div>
                <v-chip
                  v-for="f in frame(l.FrameID).Mechtype"
                  :small="!$vuetify.display.mdAndDown"
                  :x-small="$vuetify.display.mdAndDown"
                  dark
                  variant="outlined"
                  color="accent"
                  class="mr-2"
                >
                  {{ f }}
                </v-chip>
              </div>
              <v-img
                :class="$vuetify.display.mdAndDown ? 'img-mobile' : 'img-hover'"
                cover
                max-height="100"
                :src="frame(l.FrameID).DefaultImage"
                :position="`top ${frame(l.FrameID).YPosition}% left 80px`"
              />
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <cc-license-panel :license="l" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-divider class="mt-5 mb-0" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import { CompendiumStore } from '@/stores';

export default {
  name: 'licenses',
  computed: {
    licenses() {
      const licenseData = CompendiumStore().Licenses.filter((x) => !x.Hidden);
      return _.groupBy(licenseData, 'Source');
    },
  },
  methods: {
    manufacturer(id: string) {
      return (
        CompendiumStore().Manufacturers.find((x) => x.ID === id) || {
          GetColor: () => 'black',
          Name: 'err',
          LogoIsExternal: false,
          Icon: 'gms',
        }
      );
    },
    frame(id: string) {
      return CompendiumStore().referenceByID('Frames', id);
    },
  },
};
</script>

<style scoped>
/* .hover-parent {
  position: relative;
  display: inline-block;
} */

.img-hover {
  opacity: 0.55;
  transition: all 0.3s ease-in-out;
}

.hover-parent:hover > .img-hover {
  opacity: 1;
}

.border-primary .img-hover {
  opacity: 1;
}

.img-mobile {
  opacity: 0.1;
  transition: all 0.3s ease-in-out;
}

.mobile-parent:hover > .img-mobile {
  opacity: 1;
}

.border-primary .img-mobile {
  opacity: 1;
}
</style>
