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
              ? 'Hide unauthorized systems'
              : 'Show unauthorized systems'
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
              ? 'Hide systems above SP capacity'
              : 'Show systems above SP capacity'
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
        :items="systems"
        :expand="true"
        :search="search"
        item-key="id"
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
                    {{ pilot.callsign }} does not have the license for this
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
              <span class="subheading">{{ props.item.SP }}</span>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-card-text>
              <system-card :itemData="props.item" table-item />
            </v-card-text>
          </v-card>
        </template>
      </v-data-table>
      <v-layout v-if="currentEquip" justify-space-between class="pt-4">
        <v-flex xs1></v-flex>
        <v-flex shrink>
          <v-btn v-if="currentEquip.err" color="amber darken-4" @click="remove">
            Uninstall Missing System
          </v-btn>
          <v-btn v-else color="amber darken-4" @click="remove">
            Uninstall {{ currentEquip.Name }}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { SystemCard } from '../../components/UI'
import { MechLoadout, MechSystem, SystemType, Pilot } from '@/class'
import { rules } from 'lancer-data'

export default Vue.extend({
  name: 'system-table',
  components: { SystemCard },
  props: {
    loadout: MechLoadout,
    maxSP: Number,
    currentEquip: MechSystem,
    index: Number,
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
      { text: 'System', align: 'left', value: 'Name' },
      { text: 'Source', align: 'left', value: 'Source' },
      { text: 'License', align: 'left', value: 'License' },
      { text: 'SP Cost', align: 'left', value: 'SP' },
    ],
  }),
  computed: {
    freeSP(): number {
      const remaining = this.maxSP - this.loadout.TotalSP
      return this.currentEquip ? remaining + this.currentEquip.SP : remaining
    },
    systems(): MechSystem[] {
      const vm = this as any
      const allSystems = vm.$store.getters.getItemCollection(
        'MechSystems'
      ) as MechSystem[]
      let i = allSystems.filter(x => x.Source)
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
      if (vm.currentEquip) i = i.filter(x => x !== vm.currentEquip)

      if (vm.search)
        i = i.filter(x =>
          x.Name.toLowerCase().includes(vm.search.toLowerCase())
        )

      i = i.filter(x => !vm.loadout.UniqueSystems.includes(x))

      // AI limit
      const aiLimit = this.pilot.has('Talent', 'techno', 3) ? 2 : 1
      const aiTotal = this.loadout.Systems.filter(x => x.Type === SystemType.AI)
        .length
      if (aiTotal >= aiLimit) i = i.filter(x => x.Type !== SystemType.AI)

      return i
    },
    pilot(): Pilot {
      return (this as any).$store.getters['getPilot']
    },
  },
  methods: {
    select(item: MechSystem) {
      if (this.currentEquip) {
        this.loadout.ChangeSystem(this.index, item)
      } else {
        this.loadout.AddSystem(item)
      }
      this.$emit('close')
    },
    remove() {
      this.loadout.RemoveSystem(this.currentEquip)
      this.$emit('close')
    },
    isLocked(item: MechSystem): boolean {
      if (item.Source === 'GMS') return false
      return !this.pilot.has('License', item.License, item.LicenseLevel)
    },
    isOverSp(sp: number): boolean {
      return sp > this.freeSP
    },
  },
})
</script>
