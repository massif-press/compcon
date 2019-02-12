<template>
  <div>
    <v-container fluid>
      <!-- Filters -->
      <v-layout>
        <v-flex v-for="filter in filters" :key="filter">
          <v-btn block 
            :variant="selectedFilters.includes(filter) ? 'primary' : ''" 
            @click="toggleFilter(filter)">{{filter}}
          </v-btn>
        </v-flex>
        <v-flex xs4>
          <b-input-group>
            <b-input-group-text slot="prepend">
              <b-icon name="search" />
            </b-input-group-text>
            <b-form-input v-model="filterText"></b-form-input>
            <b-input-group-append>
              <v-btn @click="filterText = ''"><b-icon name="times" /></v-btn>
            </b-input-group-append>
          </b-input-group>
        </v-flex>
      </v-layout>

      <hr>
      <!-- Content -->
        <v-layout>
          <v-flex shrink>&nbsp;</v-flex>
          <v-flex ><v-btn block @click="updateSort('name')">name</v-btn></v-flex>
          <v-flex shrink><v-btn block @click="updateSort('source')">source</v-btn></v-flex>
          <v-flex shrink><v-btn block @click="updateSort('rarity')">rarity</v-btn></v-flex>
        </v-layout>
        <hr>
        <div class="scrollcontainer">
      <div v-for="(item, index) in items" :key="item.id" >
        <v-layout>
          <v-flex shrink><v-btn v-b-toggle="`collapse_${item.id}`"><b-icon name="caret-right" /></v-btn></v-flex>
          <v-flex>
            <v-btn block :variant="index === selectedIndex ? 'primary' : ''" @click="select(index, item)">
              <span class="float-left">{{item.name}}</span>
            </v-btn>
          </v-flex>
          <v-flex xs1>{{item.source}}</v-flex>
          <v-flex xs1><span v-for="n in item.rarity" :key="n + item.id" v-html="'*'" /></v-flex>
        </v-layout>
        <b-collapse :id="`collapse_${item.id}`">
          <v-layout>
            <v-flex>
              <gear-card :itemData="item"/>
            </v-flex>
          </v-layout>
        </b-collapse>
      </div>
        </div>
    </v-container>
  </div>   
</template>

<script>
  import GearCard from './GearCard'

  export default {
    name: 'item-table',
    components: { GearCard },
    props: [ 'itemType' ],
    data: () => ({
      selectedIndex: -1,
      filterText: '',
      sortRule: null,
      selectedFilters: []
    }),
    computed: {
      items: function () {
        var cmp = this
        // filter by rarity
        var rarities = this.$store.getters.getRarities
        var i = cmp.$store.getters.getItemCollection('PilotGear').filter(
          x => rarities[x.source] >= x.rarity
        )

        // filter by type
        i = cmp.itemType === 'webbing'
          ? i.filter(x => x.type === 'gear' || x.type === 'weapon')
          : i.filter(x => cmp.itemType === x.type)

        // filter UI options
        i = i.filter(x => cmp.selectedFilters.includes(x.source) &&
          x.name.toLowerCase().includes(cmp.filterText.toLowerCase())
        )

        // sort UI options
        if (cmp.sortRule) {
          i.sort(function (a, b) {
            var field = cmp.sortRule.field
            if (Number.isInteger(a[field])) {
              return cmp.sortRule.dir === 'asc'
                ? a[field] - b[field]
                : b[field] - a[field]
            } else {
              var fA = a[field].toLowerCase()
              var fB = b[field].toLowerCase()
              return cmp.sortRule.dir === 'asc'
                ? (fA < fB) ? -1 : (fA > fB) ? 1 : 0
                : (fA > fB) ? -1 : (fA < fB) ? 1 : 0
            }
          })
        }

        return i
      },
      filters: function () {
        return this.$store.getters.getItemCollection('Manufacturers').map(x => x.id)
      }
    },
    methods: {
      select: function (index, item) {
        this.selectedIndex = index
        this.$emit('select-item', item)
      },
      updateSort (field) {
        if (!this.sortRule) {
          this.sortRule = {dir: 'asc', field: field}
        } else {
          if (this.sortRule.dir === 'asc' && this.sortRule.field === field) this.sortRule.dir = 'desc'
          else this.sortRule.dir = 'asc'
          this.sortRule.field = field
        }
      },
      toggleFilter (filter) {
        var idx = this.selectedFilters.indexOf(filter)
        if (idx > -1) {
          this.selectedFilters.splice(idx, 1)
        } else {
          this.selectedFilters.push(filter)
        }
      }
    },
    mounted () {
      this.selectedFilters = JSON.parse(JSON.stringify(this.filters))
    }
  }
</script>

<style scoped>
 .scrollcontainer {
   height: 61.5vh;
   overflow-y: scroll;
   overflow-x: hidden;
 }
</style>
