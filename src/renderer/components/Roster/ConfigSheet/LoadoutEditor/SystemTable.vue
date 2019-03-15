<template>
  <v-card flat dark>
    <v-toolbar class="mt-5 pt-1">
      <v-tooltip top nudge-bottom="20px">
        <div class="pt-3" slot="activator">
        <v-switch color="yellow" v-model="showLocked">
          <v-icon v-if="showLocked" dark slot="append" color="yellow">lock_open</v-icon>
          <v-icon v-else dark slot="append">lock</v-icon>
        </v-switch>
        </div>
        <span v-if="!showLocked">Show unauthorized systems</span>
        <span v-else>Hide unauthorized systems</span>
      </v-tooltip>

      <v-tooltip top class="ml-5" nudge-bottom="20px">
        <div class="pt-3" slot="activator">
        <v-switch color="warning" v-model="showOverSp">
          <v-icon v-if="showOverSp" dark slot="append" color="warning">flash_off</v-icon>
          <v-icon v-else dark slot="append">flash_on</v-icon>
        </v-switch>
        </div>
        <span v-if="!showOverSp">Show systems above SP capacity</span>
        <span v-else>Hide systems above SP capacity</span>
      </v-tooltip>

      <v-spacer />
      <v-autocomplete flat dense v-model="search" :items="systems" clearable hide-details hide-selected item-text="name" item-value="name" label="Search..." solo />
    </v-toolbar>

    <v-container fluid class="mt-0 pt-0">
      <v-data-table :headers="headers" :items="systems" :expand="true" item-key="id" hide-actions>
        <template slot="items" slot-scope="props">
          <tr @click="props.expanded = !props.expanded">
            <td style="padding: 0!important;"><v-btn color="primary" @click="select(props.item)" class="p-0 m-0">equip</v-btn></td>
            <td><span class="subheading">{{ props.item.name }}
                <v-tooltip v-if="isLocked(props.item.license, props.item.license_level)" top>
                  <v-icon color="warning" slot="activator">warning</v-icon>
                  <span>{{pilot.callsign}} does not have the license for this system ({{props.item.license}} {{props.item.license_level}})</span>
                </v-tooltip>
                <v-tooltip v-if="isOverSp(props.item.sp)" top>
                  <v-icon color="yellow" slot="activator">warning</v-icon>
                  <span>Insufficient free SP to install this system</span>
                </v-tooltip>
              </span>
            </td>
            <td class="text-xs-left"><span class="subheading">{{ props.item.source }}</span></td>
            <td class="text-xs-left"><span class="subheading">{{ props.item.license }} {{props.item.license_level}}</span></td>
            <td class="text-xs-left"><span class="subheading">{{ props.item.sp }}</span></td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-card-text><system-card :itemData="props.item" /></v-card-text>
          </v-card>
        </template>
      </v-data-table>
      <v-layout v-if="current_equip" justify-space-between class="pt-4">
        <v-flex xs1></v-flex>
        <v-flex shrink>
          <v-btn color="warning" flat @click="remove">Uninstall {{item(current_equip.id).name}}</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
  import SystemCard from '../../UI/SystemCard'

  export default {
    name: 'system-table',
    components: { SystemCard },
    props: {
      installed_systems: Array,
      free_sp: Number,
      loadout_index: Number,
      current_equip: Object
    },
    data: () => ({
      selectedIndex: -1,
      filterText: '',
      sortRule: null,
      search: null,
      searchFilter: null,
      showLocked: false,
      showOverSp: false,
      headers: [
        {align: 'left', sortable: false, width: '5vw'},
        {text: 'System', align: 'left', value: 'name'},
        {text: 'Source', align: 'left', value: 'source'},
        {text: 'License', align: 'left', value: 'license'},
        {text: 'SP Cost', align: 'left', value: 'sp'}
      ]
    }),
    computed: {
      systems: function () {
        var vm = this

        var allSystems = vm.$store.getters.getItemCollection('MechSystems')

        var i = allSystems.filter(x => x.source)

        if (!vm.showLocked) {
          i = i.filter(x => x.source === 'GMS' || (this.pilot.licenses.find(y => y.name === x.license) &&
            this.pilot.licenses.find(y => y.name === x.license).level >= x.license_level))
        }

        if (!vm.showOverSp) {
          console.log(vm.showOverSp)
          // if an item is currently equipped to this slot, look it up to find sp value for exchange
          var totalFreeSp = this.current_equip ? this.free_sp + allSystems.find(x => x.id === this.current_equip.id).sp || 0 : this.free_sp
          i = i.filter(x => x.sp <= totalFreeSp)
        }

        // filter dupe uniques
        i = i.filter(x => (x.tags && !x.tags.map(t => t.id).includes('unique')) || (x.tags && x.tags.map(t => t.id).includes('unique') && !this.installed_systems.map(y => y.id).includes(x.id)))

        if (vm.search) i = i.filter(x => x.name.toLowerCase().includes(vm.search.toLowerCase()))

        return i
      },
      pilot: function () {
        return this.$store.getters.getPilot
      }
    },
    methods: {
      select: function (item) {
        this.$emit('select-item', item, this.loadout_index)
      },
      remove: function () {
        this.$emit('remove-item', this.loadout_index)
      },
      item: function (id) {
        return this.$store.getters.getItemById('MechSystems', id)
      },
      isLocked: function (name, level) {
        if (!name) return false
        return !((this.pilot.licenses.find(y => y.name === name) && this.pilot.licenses.find(y => y.name === name).level >= level))
      },
      isOverSp: function (sp) {
        var totalFreeSp = this.current_equip ? this.free_sp + this.$store.getters.getItemCollection('MechSystems').find(x => x.id === this.current_equip.id).sp || 0 : this.free_sp
        return sp > totalFreeSp
      }
    }
  }
</script>