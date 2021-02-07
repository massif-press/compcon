<template>
  <v-container>
    <div v-for="s in sources" :key="s.ID">
      <v-row no-gutters align="center" justify="center">
        <v-col cols="auto">
          <cc-logo
            :size="$vuetify.breakpoint.mdAndUp ? 'xLarge' : 'large'"
            :source="s"
            class="mb-n2"
          />
        </v-col>
        <v-col cols="auto">
          <div class="heading h1" :style="`color: ${s.GetColor($vuetify.theme.dark)}`">
            {{ s.Name }}
          </div>
        </v-col>
      </v-row>
      <v-row align="center" justify="center" class="mt-0 mb-3">
        <v-col v-for="item in itemsBySource(s.ID)" :key="`card_${item.ID}`" cols="4">
          <v-hover v-slot="{ hover }">
            <v-card
              class="clipped-large"
              :color="hover ? 'panel lighten-1' : 'panel'"
              tile
              @click="$refs[`diag_${item.ID}`][0].show()"
            >
              <v-img
                v-if="item.DefaultImage"
                :src="item.DefaultImage"
                max-width="35vw"
                max-height="200px"
                contain
                class="py-2"
              />
              <div v-else>
                <v-row
                  no-gutters
                  justify="space-around"
                  align="center"
                  style="max-height: 200px; min-height: 175px"
                >
                  <v-col v-if="item.Damage" cols="auto">
                    <cc-damage-element :damage="item.Damage" />
                  </v-col>
                  <v-col v-if="item.Range" cols="auto">
                    <cc-range-element :range="item.Range" />
                  </v-col>
                  <v-col v-if="item.Tags" cols="12" class="text-center pb-2">
                    <cc-tags :tags="item.Tags" small dense outlined color="accent" />
                  </v-col>
                </v-row>
              </div>
              <v-toolbar dense :color="hover ? 'primary lighten-1' : 'primary'" dark>
                <div>
                  <div class="overline mb-n2">
                    {{ item.Source }}
                    <span v-if="item.WeaponType">{{ item.Size }} {{ item.WeaponType }}</span>
                  </div>
                  <div
                    class="heading h3"
                    style="max-width: 80%; text-overflow: ellipsis; white-space: nowrap;"
                  >
                    {{ item.Name }}
                  </div>
                </div>
              </v-toolbar>
            </v-card>
          </v-hover>
          <cc-solo-dialog :ref="`diag_${item.ID}`" :title="`${item.Source} ${item.Name}`" large>
            <cc-item-card :item="item" />
          </cc-solo-dialog>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'compendium-cards-view',
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
      return _.uniq(
        this.items.map(x =>
          this.compendium.Manufacturers.find(y => y.ID === x.Source.toUpperCase())
        )
      )
    },
  },
  methods: {
    itemsBySource(s) {
      return this.items.filter(x => x.Source === s)
    },
  },
})
</script>
