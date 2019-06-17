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
              ? 'Hide unauthorized weapon modifications'
              : 'Show unauthorized weapon modifications'
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
              ? 'Hide weapon modifications above SP capacity'
              : 'Show weapon modifications above SP capacity'
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
        :items="mods"
        :expand="true"
        item-key="id"
        hide-actions
        no-results-text="No modifications available"
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
                {{ props.item.name }}
                <v-tooltip v-if="isLocked(props.item)" top>
                  <v-icon color="warning" slot="activator">warning</v-icon>
                  <span>
                    {{ pilot.callsign }} does not have the license for this
                    weapon modification ({{ props.item.License }}
                    {{ props.item.LicenseLevel }})
                  </span>
                </v-tooltip>
                <v-tooltip v-if="isOverSp(props.item)" top>
                  <v-icon color="yellow" slot="activator">warning</v-icon>
                  <span>
                    Insufficient free SP to install this weapon modification
                  </span>
                </v-tooltip>
              </span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.Source }}</span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">
                {{ props.item.License }} {{ props.item.LicenseLevel }}
              </span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.SP }}</span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.AppliedString }}</span>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-card-text>
              <p
                v-if="props.item.Description"
                v-html="props.item.Description"
                class="fluff-text"
              />
              <p
                v-if="props.item.Effect"
                v-html="props.item.Effect"
                class="pl-2 effect-text"
              />
              <v-layout class="mt-2">
                <item-tag
                  v-for="(tag, index) in props.item.Tags"
                  :key="tag.id + index"
                  :tag-obj="tag"
                />
              </v-layout>
            </v-card-text>
          </v-card>
        </template>
      </v-data-table>
      <v-layout
        v-if="weaponSlot.Weapon && weaponSlot.Weapon.Mod"
        justify-space-between
        class="pt-4"
      >
        <v-flex xs1></v-flex>
        <v-flex shrink>
          <v-btn color="amber darken-4" @click="remove">
            Uninstall {{ weaponSlot.Weapon.Mod.Name }}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { ItemTag } from '../../components/UI'
import {
  WeaponMod,
  Pilot,
  WeaponSlot,
  EquippableMount,
  MechLoadout,
} from '@/class'

export default Vue.extend({
  name: 'mod-table',
  components: { ItemTag },
  props: {
    weaponSlot: WeaponSlot,
    mount: EquippableMount,
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
      { text: 'Mod', align: 'left', value: 'Name' },
      { text: 'Source', align: 'left', value: 'Source' },
      { text: 'License', align: 'left', value: 'License' },
      { text: 'SP Cost', align: 'left', value: 'SP' },
      { text: 'Applied To', align: 'left', value: 'AppliedString' },
    ],
  }),
  computed: {
    freeSP(): number {
      const remaining = this.maxSP - this.loadout.TotalSP
      return this.weaponSlot.Weapon
        ? remaining - this.weaponSlot.Weapon.SP
        : remaining
    },
    mods(): WeaponMod[] {
      const vm = this as any
      const allMods = vm.$store.getters.getItemCollection(
        'WeaponMods'
      ) as WeaponMod[]
      let i = allMods.filter(x => x.Source)
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
      // // filter already equipped
      if (vm.weaponSlot.Mod) i = i.filter(x => x !== vm.weaponSlot.Mod)
      // // filter by applied_to
      i = i.filter(x => x.AppliedTo.includes(vm.weaponSlot.Weapon.Type))
      // // filter out any mount restrictions
      i = i.filter(x => !x.Restricted || !x.Restricted.includes(vm.Weapon.Size))
      // // search input
      if (vm.search)
        i = i.filter(x =>
          x.Name.toLowerCase().includes(vm.search.toLowerCase())
        )

      return i
    },
    pilot(): Pilot {
      return this.$store.getters['getPilot']
    },
  },
  methods: {
    remove() {
      if (this.weaponSlot.Weapon) this.weaponSlot.Weapon.Mod = null
      this.$emit('close')
    },
    select(item: WeaponMod) {
      if (this.weaponSlot.Weapon) this.weaponSlot.Weapon.Mod = item
      this.$emit('close')
    },
    isLocked(item: WeaponMod): boolean {
      if (item.Source === 'GMS') return false
      return !this.pilot.has('License', item.License, item.LicenseLevel)
    },
    isOverSp(item: WeaponMod): boolean {
      return item.SP > this.freeSP
    },
  },
})
</script>
