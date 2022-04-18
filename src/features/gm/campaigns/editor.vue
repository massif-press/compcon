<template>
  <div>
    <div v-if="!campaign">ERR: NO CAMPAIGN LOADED</div>
    <v-row v-else no-gutters>
      <v-navigation-drawer
        permanent
        height="calc(100% - 48px)"
        fixed
        style="margin-top: 48px; y-overflow: scroll"
        class="pb-8"
      >
        <v-row dense class="pa-2" justify="center" align="center">
          <v-col cols="auto" class="heading h3 text-center">
            {{ campaign.Name }}
          </v-col>
        </v-row>

        <v-divider class="my-2" />
        <div class="ma-2">
          <v-btn
            :color="componentType === 'Overview' ? 'accent' : 'secondary'"
            outlined
            block
            @click="setPage(campaign, 'Overview')"
          >
            Overview
          </v-btn>

          <v-divider class="my-2" />

          <div v-for="(s, i) in campaign.Sections" :key="`section_${i}`">
            <sidebar-button :selected="s === selected" :idn="s.ItemNumber" @click="setPage(s)">
              {{ s.Title }}
            </sidebar-button>
            <div v-for="(c, j) in s.Children" :key="`section_${i}_content_${j}`" class="mt-n1">
              <sidebar-button
                :selected="c === selected"
                text
                :idn="c.ItemNumber"
                :indent="2"
                @click="setPage(c)"
              >
                {{ c.Title.toUpperCase() }}
              </sidebar-button>
              <div
                v-for="(e, k) in c.Children"
                :key="`section_${i}_content_${j}_subsection_${k}`"
                class="mt-n2"
              >
                <sidebar-button
                  :selected="e === selected"
                  :indent="3"
                  :idn="e.ItemNumber"
                  nested
                  text
                  @click="setPage(e)"
                >
                  {{ e.Title.toUpperCase() }}
                </sidebar-button>
                <div
                  v-for="(f, l) in e.Children"
                  :key="`section_${i}_content_${j}_subsection_${k}_subsection_${l}`"
                  class="mt-n2"
                >
                  <sidebar-button
                    :selected="f === selected"
                    :indent="4"
                    :idn="f.ItemNumber"
                    text
                    nested
                    @click="setPage(f)"
                  >
                    {{ f.Title.toUpperCase() }}
                  </sidebar-button>
                </div>
              </div>
            </div>
          </div>

          <v-btn class="my-1" small block color="accent" @click="campaign.AddSection()">
            <v-icon left>mdi-plus</v-icon>
            Add New Section
          </v-btn>
        </div>
        <v-divider class="my-2" />
        <div class="px-2">
          <v-btn
            block
            outlined
            class="my-2 pa-2"
            color="accent"
            @click="setPage(campaign, 'Locations')"
          >
            Locations
          </v-btn>
          <v-btn
            block
            outlined
            class="my-2 pa-2"
            color="accent"
            @click="setPage(campaign, 'Factions')"
          >
            Factions
          </v-btn>
          <v-btn
            block
            outlined
            class="my-2 pa-2"
            color="accent"
            @click="setPage(campaign, 'Characters')"
          >
            Characters
          </v-btn>
          <v-btn
            block
            outlined
            class="my-2 pa-2"
            color="accent"
            @click="setPage(campaign, 'Encounters')"
          >
            Encounters
          </v-btn>
        </div>
        <v-divider class="my-2" />
        <div class="px-2">
          <v-btn block class="my-2 pa-2" color="secondary" @click="campaign.save()">
            Save Campaign
          </v-btn>
          <v-btn block class="my-2 pa-2" color="accent" disabled>Publish Campaign</v-btn>
        </div>
      </v-navigation-drawer>
      <v-col>
        <v-fade-transition leave-absolute>
          <div style="padding-left: 256px">
            <component
              v-if="itemComponent"
              :is="itemComponent"
              :key="componentType"
              :item="selected"
            />
          </div>
        </v-fade-transition>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import * as Components from './pages'
import SidebarButton from './_components/SidebarButton.vue'

import Vue from 'vue'
export default Vue.extend({
  name: 'campaign-editor',
  components: { SidebarButton },
  data: () => ({
    campaigndata: null,
    selected: null,
    componentType: 'Overview',
  }),
  created() {
    this.selected = this.campaign
  },
  computed: {
    itemComponent() {
      return Components[this.componentType]
    },
    campaign() {
      return this.$store.getters['campaign/getCampaign']
    },
  },
  methods: {
    async setPage(item, type = false) {
      this.selected = item
      this.componentType = type ? type : item.ItemType
    },
  },
})
</script>
