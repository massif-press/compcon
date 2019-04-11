<template>
    <v-layout row wrap mt-5 px-5>
    <v-flex xs12>
        <v-text-field
        ref="input"
        class="search-field"
        prepend-icon="search"
        v-model="searchText"
        solo
        hide-details
        single-line
        placeholder="Search the Compendium"
        />
    </v-flex>
    <v-flex px-4>
        <v-subheader>
            Results
        </v-subheader>
        <v-list three-line>
          <template v-for="(item, index) in searchResults">
            <v-divider :key="index" v-if="index !== 0" />

            <v-list-tile
              :key="`${item.data_type}--${item.id}`"
            >
              <v-list-tile-content>
                  <v-chip outline label :color="colorByType(item.data_type)" class="text-uppercase">
                    {{item.data_type}}
                  </v-chip>
                  <span>{{item.name}}</span>
                <!-- <v-list-tile-sub-title default v-if="item.description">
                  {{item.description}}
                </v-list-tile-sub-title> -->
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'

export default Vue.extend({
    name: 'search-results',
    data: () => ({
        searchText: '',
        loaded: false,
    }),
    created() {
        this.searchText = this.$route.params.query
    },
    mounted() {
        const input = this.$refs.input as HTMLInputElement
        input.focus()
    },
    computed: {
        validResults(): CCItem[] {
          return _.flatten(
              _.values(
            _.pick(this.$store.state.datastore as object, ['Frames', 'MechSystems', 'MechWeapons', 'WeaponMods']),
              ),
          )
        },
        searchResults(): CCItem[] {
            if (!this.searchText) {return []}
            const results = this.validResults.filter((r) => r.name.toLowerCase().includes(this.searchText.toLowerCase()))
            return results
        },
    },
    methods: {
      colorByType(type: string) {
        if (type === 'frame') {return 'purple'}
        else if (type === 'weapon') {return 'pink darken-2'}
        else if (type === 'system') {return 'teal'}
        else {return 'primary'}
      },
    },
})
</script>