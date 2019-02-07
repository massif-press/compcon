<template>
  <div>
    <b-container fluid>
      <!-- Filters -->
      <b-form-row>
        <b-col v-for="filter in filters" :key="filter">
          <b-btn block 
            :variant="selectedFilters.includes(filter) ? 'primary' : ''" 
            @click="toggleFilter(filter)">{{filter}}
          </b-btn>
        </b-col>
        <b-col cols=4>
          <b-input-group>
            <b-input-group-text slot="prepend">
              <v-icon name="search" />
            </b-input-group-text>
            <b-form-input v-model="filterText"></b-form-input>
            <b-input-group-append>
              <b-btn @click="filterText = ''"><v-icon name="times" /></b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-form-row>

      <hr>
      <!-- Content -->
        <b-row>
          <b-col cols=auto>&nbsp;</b-col>
          <b-col><b-btn block @click="updateSort('name')">name</b-btn></b-col>
          <b-col>slotted quick data headers</b-col>
          <b-col cols=auto><b-btn block @click="updateSort('source')">source</b-btn></b-col>
        </b-row>
        <hr>
        <div class="scrollcontainer">
      <div v-for="(item, index) in items" :key="item.id" >
        <b-form-row>
          <b-col cols=auto><b-btn v-b-toggle="`collapse_${item.id}`"><v-icon name="caret-right" /></b-btn></b-col>
          <b-col>
            <b-btn block :variant="index === selectedIndex ? 'primary' : ''" @click="select(index, item)">
              <span class="float-left">{{item.name}}</span>
            </b-btn>
          </b-col>
          <b-col>slotted quick data</b-col>
          <b-col cols=1>{{item.source}}</b-col>
        </b-form-row>
        <b-collapse :id="`collapse_${item.id}`">
          <b-row>
            <b-col>expander</b-col>
          </b-row>
        </b-collapse>
      </div>
        </div>
    </b-container>
  </div>   
</template>

<script>
  export default {
    name: 'item-table',
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

        var i = cmp.$store.getters.getItemCollection('PilotGear')
          .filter(
            x => cmp.itemType === x.type &&
            cmp.selectedFilters.includes(x.source) &&
            x.name.toLowerCase().includes(cmp.filterText.toLowerCase())
          )

        if (cmp.sortRule) {
          i.sort(function (a, b) {
            var field = cmp.sortRule.field
            var fA = a[field].toLowerCase()
            var fB = b[field].toLowerCase()
            return cmp.sortRule.dir === 'asc'
              ? (fA < fB) ? -1 : (fA > fB) ? 1 : 0
              : (fA > fB) ? -1 : (fA < fB) ? 1 : 0
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
