<template>
  <panel-view ref="view">
    <cc-gm-header slot="title" flip color="secondary" title="NEW NPC // SELECT CLASS" />
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
          <template v-slot:group.header="h" class="transparent">
            <div class="primary sliced">
              <span v-if="h.group" class="heading white--text ml-2 text-uppercase">
                <v-icon v-if="h.group.toLowerCase() === 'biological'" dark>mdi-heart-pulse</v-icon>
                <v-icon v-else dark>cci-role-{{ h.group }}</v-icon>
                <span v-if="Array.isArray(h.group)" v-html="h.group.join(', ')" />
                <span v-else v-html="h.group" />
              </span>
            </div>
          </template>
          <template v-slot:item.Name="{ item }">
            <v-btn
              block
              outlined
              tile
              small
              :color="item.RoleColor"
              class="my-1"
              @click="selectedClass = item"
            >
              {{ item.Name }}
              <v-scroll-x-transition leave-absolute>
                <v-icon v-if="selectedClass === item" right color="accent">
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
          <v-btn large block color="primary" :disabled="!selectedClass" @click="AddNpc()">
            <v-icon left>mdi-plus</v-icon>
            <span v-if="selectedClass">Add New {{ selectedClass.Name }}</span>
            <span v-else>Select NPC Class</span>
          </v-btn>
          <v-btn outlined block small class="mt-1" to="/gm/npc-roster">
            <v-icon left>mdi-chevron-left</v-icon>
            Return to NPC Roster
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <template slot="right">
      <router-view />
      <class-card v-if="selectedClass" ref="card" :npcc="selectedClass" />
      <v-row v-else align="center" justify="center" style="width: 100%; height: 100%;">
        <v-col cols="auto">
          <span class="heading h1 subtle--text text--lighten-2">select npc class</span>
        </v-col>
      </v-row>
    </template>
  </panel-view>
</template>

<script lang="ts">
import Vue from 'vue'
import PanelView from '../../components/PanelView.vue'
import ClassCard from './ClassCard.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, NpcStore } from '@/store'
import { Npc } from '@/class'

export default Vue.extend({
  name: 'npc-manager',
  components: { PanelView, ClassCard },
  data: () => ({
    search: '',
    selectedClass: null,
    grouping: null,
    headers: [{ text: 'Name', value: 'Name', align: 'left' }],
    classes: [],
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
      const store = getModule(NpcStore, this.$store)
      store.addNpc(new Npc(this.selectedClass, this.$refs.card.tierPreview))
      this.$router.push('./npc-roster')
    },
  },
})
</script>

<style>
.v-row-group__header,
.v-row-group__summary {
  background: transparent !important;
}
</style>
