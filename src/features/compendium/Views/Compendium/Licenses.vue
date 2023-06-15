<template>
  <v-container>
    <v-row align="center" id="top">
      <v-col>
        <h1 class="heading">LICENSES</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn
          v-for="m in manufacturers"
          v-show="hasLicenses(m.ID)"
          icon
          flat
          class="fade-select mx-1"
          @click="scrollTo(m.ID)"
        >
          <v-icon size="40" :icon="m.Icon" :color="m.Color" />
        </v-btn>
      </v-col>
    </v-row>
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
              :icon="manufacturer(m).Icon"
              :color="manufacturer(m).GetColor($vuetify.theme.current.dark)"
            />
          </v-col>
          <v-col
            cols="auto"
            :class="$vuetify.display.mdAndDown ? 'heading h2' : 'heading mech'"
            :style="`color: ${manufacturer(m).GetColor($vuetify.theme.current.dark)}`"
          >
            {{ manufacturer(m).Name }}
          </v-col>
        </v-row>
        <v-expansion-panels accordion focusable>
          <v-expansion-panel v-for="l in licenses[m]" :id="m">
            <v-expansion-panel-title class="hover-parent py-0 pr-0 pl-3" hide-actions>
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
              <div
                :class="$vuetify.display.mdAndDown ? 'img-mobile' : 'img-hover'"
                :style="`background-image: url('${frame(l.FrameID).DefaultImage}'); height:110px;
              width:100%;  background-position: top ${frame(l.FrameID).YPosition}% left 80px`"
              />
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <cc-license-panel :license="l" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-btn
      size="x-small"
      variant="tonal"
      icon
      color="primary"
      class="fade-select"
      style="position: fixed; bottom: 0px; right: 0; margin: 8px; z-index: 999"
      @click="scrollTo('top')"
    >
      <v-icon size="30">mdi-arrow-up</v-icon>
    </v-btn>
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
    manufacturers() {
      return CompendiumStore().Manufacturers;
    },
  },
  methods: {
    manufacturer(id: string) {
      return (
        this.manufacturers.find((x) => x.ID === id) || {
          GetColor: () => 'black',
          Name: 'err',
          LogoIsExternal: false,
          Icon: 'gms',
        }
      );
    },
    hasLicenses(id: string): boolean {
      return this.licenses[id] && this.licenses[id].length > 0;
    },
    scrollTo(id: string): void {
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -120;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },

    frame(id: string) {
      return CompendiumStore().referenceByID('Frames', id);
    },
  },
};
</script>

<style scoped>
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
