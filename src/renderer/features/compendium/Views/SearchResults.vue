<template>
    <v-layout row wrap mt-5 px-5>
    <v-flex xs12 px-2>
        <v-text-field
        ref="input"
        class="search-field"
        prepend-icon="search"
        @input="debounceInput"
        :value="this.searchText"
        solo
        hide-details
        single-line
        placeholder="Search"
        />
    </v-flex>
    <v-flex>
        <v-subheader>
            {{searchResults.length}} result{{searchResults.length === 1 ? '' : 's'}}
        </v-subheader>
        <v-slide-y-reverse-transition mode="out-in">
        <v-layout row wrap :key="searchText">
          <v-flex grow xs12 md6 lg4 xl3 px-2 py-2 :key="index" v-for="(item, index) in searchResults">
            <v-card v-ripple :to="`/compendium/item/${item.data_type}/${item.id}`">
              <v-card-title primary-title :style="{ backgroundColor: colors[item.data_type].light }" :class="{ 'full-title': !item.description }" class="white--text">
                <div class="headline">{{ item.data_type === 'frame' ? `${item.source} ` : '' }}{{ item.name }}</div>
                <v-chip disabled outline label color="white" class="text-uppercase ml-auto">
                      {{item.data_type}}
                </v-chip>
              </v-card-title>
              <v-card-text v-if="item.description"><span v-html="item.description" class="item-description"></span></v-card-text>
              <!-- <v-card-actions>
                <v-btn flat>More</v-btn>
              </v-card-actions> -->
            </v-card>
          </v-flex>
        </v-layout>
        </v-slide-y-reverse-transition>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import colors from '@/features/_shared/UI/CCColors'

export default Vue.extend({
    name: 'search-results',
    data: () => ({
        searchText: '',
        loaded: false,
        colors: colors.colors,
    }),
    mounted() {
        this.searchText = this.$route.query.search as string
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
      setSearch(value: string) {
        if (value === this.searchText) { return }
        this.searchText = value
        this.$router.replace(`/compendium/search?search=${value}`)
      },
      debounceInput: _.debounce(function(this: any, e: string) {
        this.setSearch(e)
      }, 500),
      forceInput() {
        this.setSearch((this.$refs.input as HTMLInputElement).value)
      },
      colorByType(type: string) {
        if (type === 'frame') {return 'purple'}
        else if (type === 'weapon') {return 'pink darken-2'}
        else if (type === 'system') {return 'teal'}
        else {return 'primary'}
      },
      onClick(item: CCItem) {
        alert(item.name)
      },
    },
})
</script>

<style scoped>
.v-card {
  cursor: pointer;
  user-select: none;
  height: 100%;
}
.v-card__title > .headline
{
    max-width: 70%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.full-title {
  height: 100%;
}
.item-description {
    display: block;
    max-height: 50px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-style: italic;
    color: gray;
}
</style>
