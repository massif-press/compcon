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
        <span v-html="showLocked ? 'Hide unauthorized weapons' : 'Show unauthorized weapons'" />
      </v-tooltip>

      <v-tooltip top class="ml-5" nudge-bottom="20px">
        <div class="pt-3" slot="activator">
        <v-switch color="warning" v-model="showOverSp">
          <v-icon v-if="showOverSp" dark slot="append" color="warning">flash_off</v-icon>
          <v-icon v-else dark slot="append">flash_on</v-icon>
        </v-switch>
        </div>
        <span v-html="showOverSp ? 'Hide weapons above SP capacity' : 'Show weapons above SP capacity'" />
      </v-tooltip>

      <v-spacer />
      <v-text-field class="search-field ma-2" prepend-icon="search"
        v-model="search" flat hide-details single-line placeholder="Search" clearable />
    </v-toolbar>

    <v-container fluid class="mt-0 pt-0">
      <v-data-table :headers="headers" :items="weapons" :expand="true" item-key="id" :search="search" hide-actions>
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
              <span class="subheading">{{ props.item.mount }}</span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.type }}</span>
            </td>
            <td class="text-xs-left">
              <span class="subheading"><range-element small :range="props.item.range" /></span>
            </td>
            <td class="text-xs-left">
              <span class="subheading"><damage-element small dark size="16" :dmg="props.item.damage" /></span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.sp }}</span>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-card-text>
              <weapon-card :itemData="props.item" table-item/>
            </v-card-text>
          </v-card>
        </template>
      </v-data-table>
      <v-layout v-if="current_equip" justify-space-between class="pt-4">
        <v-flex xs1></v-flex>
        <v-flex shrink>
          <v-btn color="amber darken-4" @click="remove">Uninstall {{item(current_equip.id).name}}</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
  import Vue from 'vue'
  import _ from 'lodash'
  import {rules} from 'lancer-data'
  import {RangeElement, DamageElement, WeaponCard} from '../../components/UI'

  import io from '@/features/_shared/data_io'

  export default Vue.extend({
    name: 'weapon-table',
    components: { WeaponCard, RangeElement, DamageElement },
    props: {
      installed_systems: Array,
      free_sp: Number,
      loadout_index: Number,
      current_equip: Object,
      size: String,
      config_id: String
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
        {text: 'Weapon', align: 'left', value: 'name'},
        {text: 'Source', align: 'left', value: 'source'},
        {text: 'License', align: 'left', value: 'license'},
        {text: 'Size', align: 'left', value: 'mount'},
        {text: 'Type', align: 'left', value: 'type'},
        {text: 'Range', align: 'left', value: 'range[0].val'},
        {text: 'Damage', align: 'left', value: 'damage[0].val'},
        {text: 'SP Cost', align: 'left', value: 'sp'}
      ]
    }),
    computed: {
      weapons () {
        var vm = this as any
        var allWeapons = vm.$store.getters['getItemCollection']('MechWeapons')
        var fittings = rules.mount_fittings[vm.size]
        var i = allWeapons.filter((x: Weapon) => x.source && fittings.includes(x.mount))
        if (!vm.showLocked) {
          i = i.filter((x: Weapon) => x.source === 'GMS' 
            || (
              vm.pilot.licenses.find((y: any) => y.name === x.license) 
              && vm.pilot.licenses.find((y: any) => y.name === x.license).level >= x.license_level
            )
          )
        }
        if (!vm.showOverSp) {
          // if an item is currently equipped to this slot, look it up to find sp value for exchange
          var totalFreeSp = vm.current_equip 
            ? vm.free_sp + (allWeapons.find((x: Weapon) => x.id === vm.current_equip.id).sp || 0) 
            : vm.free_sp
          i = i.filter((x: Weapon) => !x.sp || x.sp <= totalFreeSp)
        }
        // filter dupe uniques (in the grossest way possible)
        var configIndex = vm.pilot.configs.findIndex((x: any) => x.id === vm.config_id)
        var installedUniques = vm.pilot.configs[configIndex].loadouts[vm.loadout_index]
        installedUniques = _.compact(_.flatten(installedUniques.mounts.map((x: any) => x.weapons)))
        installedUniques = installedUniques.filter((x: any) => !vm.getWeapon(x.id).err)
        installedUniques = installedUniques.map((x: any) => vm.getWeapon(x.id)).filter(
          (x: Weapon) => x.tags.map((y: any) => y.id).includes('unique')
        ).map((x: Weapon) => x.id)
        i = i.filter((x: Weapon) => !installedUniques.includes(x.id))

        return i
      },
      pilot (): Pilot {
        return (this as any).$store.getters['getPilot']
      }
    }, 
    methods: {
      select (item) {
        if ((this as any).size === 'heavy') {
          if (item.mount === 'Superheavy') {
            this.$emit('unlock-sh')
            this.$emit('select-superheavy', item)
          } else {
            this.$emit('unlock-sh')
            this.$emit('select-item', item)
          }
        } else {
          this.$emit('select-item', item)
        }
      },
      remove () {
        this.$emit('remove-item')
      },
      item (id: string): Weapon {
        return this.$store.getters['getItemById']('MechWeapons', id)
      },
      isLocked (name: string, level: number): boolean {
        if (!name) return false
        var vm = this as any
        return !(
          (vm.pilot.licenses.find((y: any) => y.name === name) 
            && vm.pilot.licenses.find((y: any) => y.name === name).level >= level))
      },
      isOverSp (sp: number): boolean {
        var vm = this as any
        var totalFreeSp = vm.current_equip 
        ? vm.free_sp + vm.$store.getters['getItemCollection']('MechWeapons').find(
          (x: Weapon) => x.id === vm.current_equip.id
          ).sp || 0 
        : vm.free_sp
        return sp > totalFreeSp
      }
    }
  })
</script>