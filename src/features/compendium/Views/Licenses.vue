<template>
  <v-container fluid px-5>
    <h1 v-resize-text="{ maxFontSize: '36pt' }" class="heading">LICENSES</h1>
    <v-row v-for="m in Object.keys(licenses)" :key="m">
      <v-col class="text-center pa-3">
        <div>
          <cc-logo
            :source="manufacturer(m)"
            :size="$vuetify.breakpoint.mdAndDown ? 'large' : 'xLarge'"
            class="pt-4"
          />
          <span
            :class="$vuetify.breakpoint.mdAndDown ? 'heading h2' : 'heading mech'"
            :style="`width: 100%; color: ${manufacturer(m).Color}`"
          >
            {{ manufacturer(m).Name }}
          </span>
        </div>
        <v-expansion-panels accordion focusable active-class="border-primary">
          <v-expansion-panel
            v-for="l in licenses[m]"
            :key="l.FrameID"
            class="panel border-highlight"
          >
            <v-expansion-panel-header id="hover-parent" hide-actions>
              <div>
                <span>
                  <span class="caption">{{ frame(l.FrameID).Source }}</span>
                  <br />
                  <span class="heading h2 font-weight-bold">{{ frame(l.FrameID).Name }}</span>
                </span>
                <br v-if="$vuetify.breakpoint.mdAndDown" />
                <v-chip
                  v-for="f in frame(l.FrameID).Mechtype"
                  :key="f"
                  :small="!$vuetify.breakpoint.mdAndDown"
                  :x-small="$vuetify.breakpoint.mdAndDown"
                  dark
                  outlined
                  color="accent"
                  class="mr-2"
                >
                  {{ f }}
                </v-chip>
              </div>
              <v-img
                :id="$vuetify.breakpoint.mdAndDown ? 'img-mobile' : 'img-hover'"
                :src="frame(l.FrameID).DefaultImage"
                max-height="100%"
                :position="`top ${frame(l.FrameID).YPosition}% left 20vw`"
                style="position:absolute; top: 0; right: 0;"
              />
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <cc-license-panel :license="l" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-divider class="mt-5 mb-0" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'licenses',
  computed: {
    licenses() {
      const licenseData = getModule(CompendiumStore, this.$store).Licenses
      return this.$_.groupBy(licenseData, 'Source')
    },
  },
  methods: {
    manufacturer(id: string) {
      const compendium = getModule(CompendiumStore, this.$store)
      return compendium.Manufacturers.find(x => x.ID === id)
    },
    frame(id: string) {
      const compendium = getModule(CompendiumStore, this.$store)
      return compendium.referenceByID('Frames', id)
    },
  },
})
</script>

<style scoped>
#img-hover {
  opacity: 0.55;
  transition: all 0.3s ease-in-out;
}

#hover-parent:hover > #img-hover {
  opacity: 1;
}

.border-primary #img-hover {
  opacity: 1;
}

#img-mobile {
  opacity: 0.1;
  transition: all 0.3s ease-in-out;
}

#mobile-parent:hover > #img-mobile {
  opacity: 1;
}

.border-primary #img-mobile {
  opacity: 1;
}
</style>
