<template>
  <v-col>
    <v-btn large block color="primary" class="white--text" @click="dialog = true">
      {{ item.Class ? item.Class.Name : 'Set NPC Class' }}
    </v-btn>

    <v-dialog v-model="dialog">
      <v-card>
        <v-toolbar dense color="primary">
          <span class="heading h6 white--text">Select Template</span>
          <v-spacer />
          <v-btn icon color="white" @click="dialog = false"><v-icon large>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <panel-view ref="view">
          <template slot="left">
            <v-row dense>
              <v-col>
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  dense
                  hide-details
                  outlined
                  clearable
                />
              </v-col>
            </v-row>
            <v-divider class="my-2 " />
            <v-row dense style="max-height: calc(100% - 145px); overflow-y: scroll">
              <v-data-table
                dense
                :items="classes"
                :headers="headers"
                :search="search"
                group-by="Role"
                hide-default-footer
                hide-default-header
                no-results-text="No NPC Classes Found"
                class="transparent"
                style="min-width: 100%"
                disable-pagination
              >
                <template v-slot:group[`header`]`="h" class="transparent">
                  <div class="primary sliced">
                    <span v-if="h.group" class="heading white--text ml-2 text-uppercase">
                      <v-icon v-if="h.group.toLowerCase() === 'biological'" dark>
                        mdi-heart-pulse
                      </v-icon>
                      <v-icon v-else dark>cci-role-{{ h.group }}</v-icon>
                      <span v-if="Array.isArray(h.group)" v-html="h.group.join(', ')" />
                      <span v-else v-html="h.group" />
                    </span>
                  </div>
                </template>
                <template v-slot:[`item.Name`]="{ item }">
                  <v-btn
                    block
                    outlined
                    tile
                    small
                    :color="item.RoleColor"
                    class="my-1"
                    @click="selected = item"
                  >
                    {{ item.Name }}
                    <v-scroll-x-transition leave-absolute>
                      <v-icon v-if="selected === item" right color="accent">
                        mdi-chevron-triple-right
                      </v-icon>
                    </v-scroll-x-transition>
                  </v-btn>
                </template>
              </v-data-table>
            </v-row>
            <v-divider class="mt-2" />
            <v-row justify="center" dense class="mb-n10">
              <v-col cols="10">
                <v-btn large block color="primary" :disabled="!selected" @click="AddNpc()">
                  <v-icon left>mdi-edit</v-icon>
                  <span v-if="selected">Set {{ selected.Name }} Class</span>
                  <span v-else>Select NPC Class</span>
                </v-btn>
              </v-col>
            </v-row>
          </template>
          <template slot="right">
            <v-container v-if="selected">
              <v-row dense>
                <v-col cols="auto" class="mt-4">
                  <span class="heading mech" style="line-height: 0">
                    {{ selected.Name }}
                  </span>
                </v-col>
                <v-col v-if="selected.InLcp" class="ml-auto mt-n4">
                  <div class="heading h3 text--text">{{ selected.LcpName }}</div>
                </v-col>
                <v-col cols="auto" class="ml-auto text-center mt-n4">
                  <v-icon size="60">{{ selected.RoleIcon }}</v-icon>
                  <div class="overline mt-n1">{{ selected.Role }}</div>
                </v-col>
              </v-row>
              <p class="flavor-text panel pa-2 stark--text" v-html-safe="selected.Flavor" />
              <span class="heading h3 accent--text">Tactics</span>
              <p class="body-1" v-html-safe="selected.Tactics" />

              <v-divider class="mb-3" />

              <v-row dense>
                <tiered-attribute
                  v-for="i in hase"
                  :key="`hase_item_${i}`"
                  :title="i"
                  :arr="selected.Stats.StatArr(i)"
                />
              </v-row>
              <v-row dense>
                <v-col class="text-center">
                  <div class="caption">SIZE</div>
                  <div
                    class="heading h3 primary--text"
                    v-html="
                      selected.Stats.Sizes(tierPreview)
                        .join(' or ')
                        .replace('0.5', '½')
                    "
                  />
                </v-col>
                <tiered-attribute
                  v-for="i in p1"
                  :key="`p1_item_${i}`"
                  :title="i"
                  :arr="selected.Stats.StatArr(i)"
                />
              </v-row>
              <v-row dense>
                <tiered-attribute
                  v-for="i in p2"
                  :key="`p1_item_${i}`"
                  :title="i"
                  :arr="selected.Stats.StatArr(i)"
                />
              </v-row>

              <v-expansion-panels :value="[0, 1]" class="mt-2" multiple>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <span class="heading h3">
                      <b class="accent--text">Base</b>
                      Features
                      <span class="caption">({{ selected.BaseFeatures.length }})</span>
                    </span>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <cc-dense-card
                      v-for="b in selected.BaseFeatures"
                      :key="b.ID"
                      :item="b"
                      class="my-1"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel v-if="selected.OptionalFeatures.length">
                  <v-expansion-panel-header>
                    <span class="heading h3">
                      <b class="accent--text">Optional</b>
                      Features
                      <span class="caption">({{ selected.OptionalFeatures.length }})</span>
                    </span>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <cc-dense-card
                      v-for="f in selected.OptionalFeatures"
                      :key="f.ID"
                      :item="f"
                      class="my-1"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-container>

            <v-row v-else align="center" justify="center" style="width: 100%; height: 100%;">
              <v-col cols="auto">
                <span class="heading h1 subtle--text text--lighten-2">select npc class</span>
              </v-col>
            </v-row>
          </template>
        </panel-view>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, NpcStore } from '@/store'
import { Npc } from '@/class'
import PanelView from '../../_components/PanelView.vue'
import TieredAttribute from '../_components/_subcomponents/TieredAttribute.vue'

export default Vue.extend({
  name: 'npc-class-selector',
  props: {
    item: { type: Object, required: true },
  },
  components: { PanelView, TieredAttribute },
  data: () => ({
    tierPreview: 1,
    dialog: false,
    selected: null,
    search: '',
    grouping: null,
    headers: [{ text: 'Name', value: 'Name', align: 'left' }],
    classes: [],
    hase: ['Hull', 'Agility', 'Systems', 'Engineering'],
    p1: ['Armor', 'HP', 'Heatcap'],
    p2: ['Evade', 'Edef', 'Speed', 'Sensor', 'Save'],
  }),
  watch: {
    selectedClass() {
      this.$refs.view.resetScroll()
    },
  },
  created() {
    const store = getModule(CompendiumStore, this.$store)
    this.classes = store.NpcClasses
  },
  methods: {
    AddNpc() {
      this.item.SetClass(this.selected, this.item.Tier)
      this.dialog = false
      // const store = getModule(NpcStore, this.$store)
      // store.addNpc(new Npc(this.selectedClass, this.$refs.card.tierPreview))
      // this.$store.dispatch('cloudSync', { callback: null, condition: 'selectedreate' })
      // this.$router.push('./npc-roster')
    },
  },
})
</script>
