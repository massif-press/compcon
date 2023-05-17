<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <cc-title>Select Frame</cc-title>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-switch v-model="showAll" dense inset hide-details color="warning">
          <cc-tooltip
            slot="label"
            simple
            inline
            :content="showAll ? 'Unlicensed frames: SHOWN' : 'Unlicensed frames: HIDDEN'"
          >
            <v-icon
              :color="showAll ? 'warning' : 'success'"
              v-html="showAll ? 'mdi-lock-open' : 'mdi-lock'"
            />
          </cc-tooltip>
        </v-switch>
      </v-col>
      <v-col cols="auto">
        <cc-filter-panel item-type="Frame" @set-filters="setFilters" />
      </v-col>
    </v-row>
    <v-row>
      <v-expansion-panels v-model="selectedFrame" accordion focusable active-class="border-primary">
        <v-expansion-panel
          v-for="f in frames"
          v-show="selectIncl(f.ID)"
          :key="f.ID"
          class="border-highlight"
        >
          <v-expansion-panel-header id="hover-parent" hide-actions>
            <v-btn
              fab
              small
              absolute
              right
              class="fade-select"
              elevation="0"
              color="panel"
              @click.stop="$refs[`modal_${f.ID}`][0].show()"
            >
              <v-icon color="accent" large>mdi-information-outline</v-icon>
            </v-btn>
            <cc-search-result-modal :ref="`modal_${f.ID}`" :item="f" />
            <div>
              <span>
                <span class="caption">{{ f.Source }}</span>
                <br />
                <span class="heading h2 font-weight-bold">{{ f.Name }}</span>
              </span>
              <v-chip
                v-for="mt in f.Mechtype"
                :key="mt"
                small
                dark
                outlined
                color="accent"
                class="mr-2"
              >
                {{ mt }}
              </v-chip>
            </div>
            <v-img
              id="img-hover"
              :src="f.DefaultImage"
              max-height="100%"
              :position="`top ${f.YPosition}% left 80px`"
              style="position: absolute; top: 0; right: 0"
            />
          </v-expansion-panel-header>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>

    <v-divider class="my-5" />

    <v-expand-transition>
      <div v-if="frames[selectedFrame]">
        <v-row justify="center">
          <v-col cols="8">
            <span class="overline">XK-4-01 // REGISTER MECH NAME</span>
            <v-text-field v-model="mechName" outlined label="Name" hide-details>
              <template v-slot:prepend>
                <cc-tooltip simple content="Generate Random Name">
                  <v-icon color="secondary" @click="randomName()">mdi-dice-multiple</v-icon>
                </cc-tooltip>
              </template>
              <template v-slot:append-outer>
                <v-icon v-if="!mechName" color="error">mdi-alert</v-icon>
                <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col cols="6">
            <v-btn tile x-large block color="secondary" :disabled="!mechName" @click="addMech()">
              Register New Mech
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { Pilot, Frame, Mech } from '@/class'
import { mechname } from '@/io/Generators'
import ItemFilter from '@/classes/utility/ItemFilter'

export default Vue.extend({
  name: 'new-mech-menu',
  props: {
    pilot: Pilot,
  },
  data: () => ({
    mechName: null,
    showAll: false,
    frames: [],
    selectedFrame: null,
    filters: {},
  }),
  computed: {
    filteredFrames() {
      let i = this.frames as Frame[]

      if (!this.showAll)
        i = i.filter(x => {
          return (
            !x.IsExotic &&
            (this.pilot.has('License', x.LicenseID, 2) ||
              this.pilot.has('License', x.LicenseID, 2) ||
              !x.LicenseLevel)
          )
        })

      if (Object.keys(this.filters).length) {
        i = ItemFilter.Filter(i, this.filters) as Frame[]
      }

      return i
        .map(x => x.ID)
        .concat(this.pilot.SpecialEquipment.filter(x => x.ItemType === 'Frame').map(f => f.ID))
    },
  },
  mounted() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.frames = _.sortBy(
      compendium.Frames.filter(x => !x.IsHidden),
      ['Source', 'Name']
    )
  },
  methods: {
    setFilters(newFilter) {
      this.filters = newFilter
    },
    selectIncl(id: string) {
      return this.filteredFrames.includes(id)
    },
    randomName() {
      this.mechName = mechname()
    },
    addMech() {
      const f = this.frames[this.selectedFrame]
      const newMech = new Mech(f, this.pilot)
      newMech.Name = this.mechName
      this.pilot.AddMech(newMech)
      this.mechName = null
      this.selectedFrame = null
      this.showAll = false
      this.$emit('close')
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
