<template>
  <v-container fluid px-5>
    <h1 class="heading">LICENSES</h1>
    <v-layout v-for="m in Object.keys(licenses)" :key="m">
      <v-flex class="text-center pa-3">
        <span class="heading mech">{{ manufacturer(m).name }}</span>
        <v-expansion-panels accordion focusable active-class="border-primary">
          <v-expansion-panel class="border-highlight" v-for="l in licenses[m]" :key="l.FrameID">
            <v-expansion-panel-header id="hover-parent" hide-actions>
              <div>
                <span>
                  <span class="caption">{{ frame(l.FrameID).Source }}</span>
                  <br />
                  <span class="major-title font-weight-bold">{{ frame(l.FrameID).Name }}</span>
                </span>
                <v-chip
                  v-for="m in frame(l.FrameID).Mechtype"
                  :key="m"
                  small
                  dark
                  outlined
                  color="primary"
                  class="mr-2"
                >
                  {{ m }}
                </v-chip>
              </div>
              <v-img
                :src="frame(l.FrameID).DefaultImage"
                max-height="100%"
                :position="`top ${frame(l.FrameID).YPosition}% left 80px`"
                id="img-hover"
                style="position:absolute; top: 0; right: 0;"
              />
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <cc-license-panel :license="l" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-divider class="mt-5 mb-0" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { LicenseCard } from '@/features/pilot_management/components/UI'

export default Vue.extend({
  name: 'licenses',
  components: { LicenseCard },
  data: () => ({
    licenses: {},
  }),
  methods: {
    manufacturer(id: string) {
      return this.$store.getters.getItemById('Manufacturers', id.toUpperCase())
    },
    frame(id: string) {
      return this.$store.getters.getItemById('Frames', id)
    },
  },
  created() {
    this.licenses = _.groupBy(this.$store.getters.getItemCollection('Licenses'), 'source')
  },
})
</script>

<style scoped>
#img-hover {
  opacity: 0.7;
  transition: all 0.3s ease-in-out;
}

#hover-parent:hover > #img-hover {
  opacity: 1;
}

.border-primary #img-hover {
  opacity: 1;
}
</style>
