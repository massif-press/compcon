<template>
  <v-card flat dark>
    <v-toolbar class="mt-5 pt-1">
      <v-tooltip top nudge-bottom="20px">
        <div class="pt-3" slot="activator">
          <v-switch color="warning" v-model="showLocked">
            <v-icon v-if="showLocked" dark slot="append" color="warning">
              lock_open
            </v-icon>
            <v-icon v-else dark slot="append">lock</v-icon>
          </v-switch>
        </div>
        <span
          v-html="
            showLocked
              ? 'Hide unauthorized weapons'
              : 'Show unauthorized weapons'
          "
        />
      </v-tooltip>

      <v-tooltip top class="ml-5" nudge-bottom="20px">
        <div class="pt-3" slot="activator">
          <v-switch color="yellow" v-model="showOverSp">
            <v-icon v-if="showOverSp" dark slot="append" color="yellow">
              flash_off
            </v-icon>
            <v-icon v-else dark slot="append">flash_on</v-icon>
          </v-switch>
        </div>
        <span
          v-html="
            showOverSp
              ? 'Hide weapons above SP capacity'
              : 'Show weapons above SP capacity'
          "
        />
      </v-tooltip>

      <v-spacer />
      <v-text-field
        class="search-field ma-2"
        prepend-icon="search"
        v-model="search"
        flat
        hide-details
        single-line
        placeholder="Search"
        clearable
      />
    </v-toolbar>

    <v-container fluid class="mt-0 pt-0">
      <v-data-table
        :headers="headers"
        :items="weapons"
        :expand="true"
        item-key="id"
        :custom-sort="customSort"
        :search="search"
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <tr @click="props.expanded = !props.expanded">
            <td style="padding: 0!important;">
              <v-btn
                color="primary"
                @click.stop="select(props.item)"
                class="p-0 m-0"
              >
                equip
              </v-btn>
            </td>
            <td>
              <span class="subheading">
                {{ props.item.Name }}
                <v-tooltip v-if="isLocked(props.item)" top>
                  <v-icon color="warning" slot="activator">warning</v-icon>
                  <span>
                    {{ pilot.Callsign }} does not have the license for this
                    system ({{ props.item.License }}
                    {{ props.item.LicenseLevel }})
                  </span>
                </v-tooltip>
                <v-tooltip v-if="isOverSp(props.item.SP)" top>
                  <v-icon color="yellow" slot="activator">warning</v-icon>
                  <span>Insufficient free SP to install this system</span>
                </v-tooltip>
              </span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.Source }}</span>
            </td>
            <td class="text-xs-left">
              <span v-if="props.item.Source !== 'GMS'" class="subheading">
                {{ props.item.License }} {{ props.item.LicenseLevel }}
              </span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.Size }}</span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.Type }}</span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">
                <range-element small :range="props.item.Range" />
              </span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">
                <damage-element small dark size="16" :dmg="props.item.Damage" />
              </span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.SP }}</span>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-card-text>
              <weapon-card :item="props.item" table-item />
            </v-card-text>
          </v-card>
        </template>
      </v-data-table>
      <v-layout v-if="weaponSlot.Weapon" justify-space-between class="pt-4">
        <v-flex xs1></v-flex>
        <v-flex shrink>
          <v-btn color="amber darken-4" @click="remove">
            Uninstall {{ weaponSlot.Weapon.Name }}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { rules } from 'lancer-data'
import { RangeElement, DamageElement, WeaponCard } from '../../components/UI'
import io from '@/features/_shared/data_io'
import {
  WeaponSlot,
  MechLoadout,
  EquippableMount,
  MechWeapon,
  Pilot,
} from '@/class'

export default Vue.extend({
  name: 'weapon-table',
  components: { WeaponCard, RangeElement, DamageElement },
  props: {
    weaponSlot: WeaponSlot,
    Size: EquippableMount,
    loadout: MechLoadout,
    maxSP: Number,
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
      { align: 'left', sortable: false, width: '5vw' },
      { text: 'Weapon', align: 'left', value: 'Name' },
      { text: 'Source', align: 'left', value: 'Source' },
      { text: 'License', align: 'left', value: 'License' },
      { text: 'Size', align: 'left', value: 'Size' },
      { text: 'Type', align: 'left', value: 'Type' },
      { text: 'Range', align: 'left', value: 'Range' },
      { text: 'Damage', align: 'left', value: 'Damage' },
      { text: 'SP Cost', align: 'left', value: 'SP' },
    ],
  }),
  computed: {
    freeSP(): number {
      const remaining = this.maxSP - this.loadout.TotalSP
      return this.weaponSlot.Weapon
        ? remaining - this.weaponSlot.Weapon.SP
        : remaining
    },
    weapons(): MechWeapon[] {
      const vm = this as any
      const allWeapons = vm.$store.getters.getItemCollection(
        'MechWeapons'
      ) as MechWeapon[]
      const fittings = rules.mount_fittings[vm.weaponSlot.Size]
      let i = allWeapons.filter(x => x.Source && fittings.includes(x.Size))
      if (!vm.showLocked) {
        i = i.filter(
          x =>
            x.Source === 'GMS' ||
            vm.pilot.has('License', x.License, x.LicenseLevel)
        )
      }
      if (!vm.showOverSp) {
        i = i.filter(x => x.SP <= vm.freeSP)
      }
      // filter already equipped
      if (vm.weaponSlot.Weapon) i = i.filter(x => x !== vm.weaponSlot.Weapon)

      if (vm.search)
        i = i.filter(x =>
          x.Name.toLowerCase().includes(vm.search.toLowerCase())
        )
      i = i.filter(x => !vm.loadout.UniqueWeapons.includes(x))

      return i
    },
    pilot(): Pilot {
      return (this as any).$store.getters['getPilot']
    },
  },
  methods: {
    select(item: MechWeapon) {
      this.$emit('select-item', item)
    },
    remove() {
      this.$emit('remove-item', this.weaponSlot.Weapon)
    },
    isLocked(item: MechWeapon): boolean {
      if (item.Source === 'GMS') return false
      return !this.pilot.has('License', item.License, item.LicenseLevel)
    },
    isOverSp(sp: number): boolean {
      return sp > this.freeSP
    },
    customSort(items, index, isDescending) {
      items.sort((a, b) => {
        if (index === 'Damage') {
          if (isDescending) {
            return b.Damage[0].Max - a.Damage[0].Max
          } else {
            return a.Damage[0].Max - b.Damage[0].Max
          }
        } else if (index === 'Range') {
          if (isDescending) {
            return b.Range[0].Max - a.Range[0].Max
          } else {
            return a.Range[0].Max - b.Range[0].Max
          }
        } else {
          if (!isDescending) {
            return a[index] < b[index] ? -1 : 1
          } else {
            return b[index] < a[index] ? -1 : 1
          }
        }
      })

      return items
    },
  },
})
</script>
