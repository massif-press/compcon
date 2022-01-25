<template>
  <v-container fluid>
    <div v-for="s in sources" :key="s.ID">
      <v-row v-if="s.Name" no-gutters align="center" justify="center">
        <v-col cols="auto">
          <cc-logo
            :size="$vuetify.breakpoint.mdAndUp ? 'xLarge' : 'large'"
            :source="s"
            class="mb-n2"
          />
        </v-col>
        <v-col cols="auto">
          <div
            :class="`heading ${$vuetify.breakpoint.mdAndDown ? 'h3' : 'h1'}`"
            :style="`color: ${s.GetColor($vuetify.theme.dark)}`"
          >
            {{ s.Name }}
          </div>
        </v-col>
      </v-row>
      <v-row align="center" justify="center" class="mt-0 mb-3">
        <compendium-card
          v-for="item in itemsBySource(s.ID)"
          :key="`card_${item.ID}`"
          :item="item"
          :small="$vuetify.breakpoint.smAndDown"
        />
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import CompendiumCard from './components/CompendiumCard.vue'

export default Vue.extend({
  name: 'compendium-cards-view',
  components: { CompendiumCard },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    selected: null,
  }),
  computed: {
    compendium() {
      return getModule(CompendiumStore, this.$store)
    },
    sources() {
      if (!this.items.some(x => !x.Source)) {
        const sources = _.uniq(this.items.map(x => x.Source))
        return sources.map((x: string) =>
        {
          const s = this.compendium.Manufacturers.find(y => y.ID === x.toUpperCase())
          return s || x
        }
        )
      }
      return ['']
    },
  },
  methods: {
    itemsBySource(s) {
      if (!s) return this.items
      return this.items.filter(x => x.Source === s)
    },
  },
})
</script>
