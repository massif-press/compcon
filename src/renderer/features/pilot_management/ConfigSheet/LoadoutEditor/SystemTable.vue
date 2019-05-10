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
        <span v-html="showLocked ? 'Hide unauthorized systems' : 'Show unauthorized systems'" />
      </v-tooltip>

      <v-tooltip top class="ml-5" nudge-bottom="20px">
        <div class="pt-3" slot="activator">
        <v-switch color="warning" v-model="showOverSp">
          <v-icon v-if="showOverSp" dark slot="append" color="warning">flash_off</v-icon>
          <v-icon v-else dark slot="append">flash_on</v-icon>
        </v-switch>
        </div>
        <span v-html="showOverSp ? 'Hide systems above SP capacity' : 'Show systems above SP capacity'" />
      </v-tooltip>

      <v-spacer />
      <v-text-field class="search-field ma-2" prepend-icon="search"
        v-model="search" flat hide-details single-line placeholder="Search" clearable />
    </v-toolbar>

    <v-container fluid class="mt-0 pt-0">
      <v-data-table :headers="headers" :items="systems" :expand="true" :search="search" item-key="id" hide-actions>
        <template slot="items" slot-scope="props">
          <tr @click="props.expanded = !props.expanded">
            <td style="padding: 0!important;">
              <v-btn color="primary" @click.stop="select(props.item)" class="p-0 m-0">equip</v-btn>
            </td>
            <td>
              <span class="subheading">{{ props.item.name }}
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
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.source }}</span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.license }} {{props.item.license_level}}</span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.sp }}</span>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-card-text>
              <system-card :itemData="props.item" table-item/>
            </v-card-text>
          </v-card>
        </template>
      </v-data-table>
      <v-layout v-if="current_equip" justify-space-between class="pt-4">
        <v-flex xs1></v-flex>
        <v-flex shrink>
          <v-btn v-if="current_equip.err" color="amber darken-4" @click="remove">Uninstall Missing System</v-btn>
          <v-btn v-else color="amber darken-4" @click="remove">Uninstall {{current_equip.name}}</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
  import Vue from 'vue'
  import _ from 'lodash'
  import {SystemCard} from '../../components/UI'

  export default Vue.extend({
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
      systems (): System[] {
        var vm = this as any
        var allSystems = vm.$store.getters['getItemCollection']('MechSystems')
        var i = allSystems.filter((x: System) => x.source)
        if (!vm.showLocked) {
          i = i.filter(
            (x: System) => x.source === 'GMS' 
            || (
              vm.pilot.licenses.find((y: any) => y.name === x.license) 
              && vm.pilot.licenses.find((y: any) => y.name === x.license).level >= x.license_level
            )
          )
        }
        if (!vm.showOverSp) {
          // if an item is currently equipped to this slot, look it up to find sp value for exchange
          var totalFreeSp = vm.current_equip && !vm.current_equip.err
            ? vm.free_sp + allSystems.find((x: System) => x.id === vm.current_equip.id).sp || 0 
            : vm.free_sp
          i = i.filter((x: System) => x.sp <= totalFreeSp)
        }
        // filter ais
        var installedAIs = vm.installed_systems.filter((x: System) => x.type === 'AI')
        if (installedAIs.length) {
          if (!vm.hasShaping || (vm.hasShaping && installedAIs.length > 1)) {
            i = i.filter((x: System) => !installedAIs.map((y: System) => y.id).includes(x.id))
          }
        }
        // filter dupe uniques
        i = i.filter(
          _.negate(
            (x: System) => x.tags && x.tags.map(t => t.id).includes('unique') 
            && vm.installed_systems.map((y: System) => y.id).includes(x.id)
          )
        )
        return i
      },
      pilot (): Pilot {
        return (this as any).$store.getters['getPilot']
      }
    },
    methods: {
      select (item: System) {
        var vm = this as any
        vm.$emit('select-item', item, vm.loadout_index)
      },
      remove () {
        var vm = this as any
        vm.$emit('remove-item', vm.loadout_index)
      },
      isLocked (name: string, level: number): boolean {
        if (!name) return false
        var vm = this as any
        return !(
          (vm.pilot.licenses.find((y: any) => y.name === name) 
          && vm.pilot.licenses.find((y: any) => y.name === name).level >= level)
        )
      },
      isOverSp (sp): boolean {
        var vm = this as any
        var totalFreeSp = vm.current_equip && !vm.current_equip.err
        ? vm.free_sp + vm.$store.getters['getItemCollection']('MechSystems').find(
          (x: System) => x.id === vm.current_equip.id
          ).sp || 0 
        : vm.free_sp
        return sp > totalFreeSp
      },
      hasShaping (): boolean {
        var vm = this as any
        return vm.pilot.talents.findIndex((x: any) => x.id === 'techno' && x.rank === 3) > -1
      }
    }
  })
</script>