<template>
  <cc-sidebar-view>
    <v-list-item
      v-for="(e, i) in bonds"
      slot="sidebar"
      :key="`${i}_sidebar'`"
      link
      @click="
        $vuetify.goTo(`#e_${e.ID}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
          container: '.v-dialog--active',
        })
      "
    >
      <v-list-item-title class="heading h3 ml-2">{{ e.Name }}</v-list-item-title>
    </v-list-item>
    <v-container>
      <cc-titled-panel
        v-for="(e, i) in bonds"
        :id="`e_${e.ID}`"
        :key="`${e.ID}_${i}`"
        :title="e.Name"
        class="my-4"
        dense
      >
        <span slot="items" class="flavor-text white--text" v-html="e.LcpName" />
        <div class="px-8">
          <v-btn color="accent" x-large block class="mt-2 mb-4" @click="$emit('set', e)">
            <b>Select {{ e.Name }}</b>
          </v-btn>
        </div>
        <v-row class="text--text" justify="space-around">
          <v-col cols="5">
            <div class="overline mb-n1 font-weight-bold">MAJOR IDEALS</div>
            <ul>
              <li v-for="(s, i) in e.MajorIdeals" :key="`mi_${e.ID}_${i}`" v-text="s" />
            </ul>
          </v-col>
          <v-col cols="5">
            <div class="overline mb-n1 font-weight-bold">MINOR IDEALS</div>
            <ul>
              <li v-for="(s, i) in e.MinorIdeals" :key="`mmi_${e.ID}_${i}`" v-text="s" />
            </ul>
          </v-col>
        </v-row>
        <v-row class="text--text" justify="space-around">
          <v-col cols="5" v-for="(q, i) in e.Questions" :key="`1_${e.ID}_${i}`">
            <div class="overline mb-n1 font-weight-bold" v-text="q.question" />
            <ul>
              <li v-for="(o, j) in q.options" :key="`qo_${e.ID}_${i}_${j}`" v-text="o" />
            </ul>
          </v-col>
        </v-row>
        <v-expansion-panels class="my-4 px-2">
          <v-expansion-panel>
            <v-expansion-panel-header class="heading h3">BOND POWERS</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card-text>
                <v-row class="mb-3">
                  <v-col xl="6" sm="12" v-for="(p, i) in e.Powers" :key="`p_${e.ID}_${i}}`">
                    <v-card
                      outlined
                      class="pa-2"
                      style="background-color: var(--v-background-darken-2)"
                    >
                      <div
                        v-if="p.veteran"
                        class="heading h4 accent--text"
                        v-text="`${p.name} (Veteran Power)`"
                      />
                      <div
                        v-else-if="p.master"
                        class="heading h4 exotic--text"
                        v-text="`${p.name} (Master Power`"
                      />
                      <div v-else class="heading h4" v-text="p.name" />
                      <div v-if="p.prerequisite" class="caption pa-2 text--disabled">
                        <i v-text="p.prerequisite" />
                      </div>
                      <div class="px-2" v-html-safe="p.description" />
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </cc-titled-panel>
    </v-container>
  </cc-sidebar-view>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'bond-selector',
  computed: {
    bonds() {
      return getModule(CompendiumStore, this.$store).Bonds
    },
  },
})
</script>
