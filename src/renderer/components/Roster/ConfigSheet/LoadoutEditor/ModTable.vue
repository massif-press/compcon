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
        <span v-if="!showLocked">Show unauthorized weapon modifications</span>
        <span v-else>Hide unauthorized weapon modifications</span>
      </v-tooltip>

      <v-tooltip top class="ml-5" nudge-bottom="20px">
        <div class="pt-3" slot="activator">
        <v-switch color="warning" v-model="showOverSp">
          <v-icon v-if="showOverSp" dark slot="append" color="warning">flash_off</v-icon>
          <v-icon v-else dark slot="append">flash_on</v-icon>
        </v-switch>
        </div>
        <span v-if="!showOverSp">Show weapon modifications above SP capacity</span>
        <span v-else>Hide weapon modifications above SP capacity</span>
      </v-tooltip>

      <v-spacer />
      <v-autocomplete flat dense v-model="search" :items="mods" clearable hide-details hide-selected item-text="name" item-value="name" label="Search..." solo />
    </v-toolbar>

    <v-container fluid class="mt-0 pt-0">
      <v-data-table :headers="headers" :items="mods" :expand="true" item-key="id" hide-actions no-results-text="No modifications available">
        <template slot="items" slot-scope="props">
          <tr @click="props.expanded = !props.expanded">
            <td style="padding: 0!important;"><v-btn color="primary" @click.stop="select(props.item)" class="p-0 m-0">equip</v-btn></td>
            <td><span class="subheading">{{ props.item.name }}
                <v-tooltip v-if="isLocked(props.item.license, props.item.license_level)" top>
                  <v-icon color="warning" slot="activator">warning</v-icon>
                  <span>{{pilot.callsign}} does not have the license for this weapon modification ({{props.item.license}} {{props.item.license_level}})</span>
                </v-tooltip>
                <v-tooltip v-if="isOverSp(props.item.sp)" top>
                  <v-icon color="yellow" slot="activator">warning</v-icon>
                  <span>Insufficient free SP to install this weapon modification</span>
                </v-tooltip>
              </span>
            </td>
            <td class="text-xs-left"><span class="subheading">{{ props.item.source }}</span></td>
            <td class="text-xs-left"><span class="subheading">{{ props.item.license }} {{props.item.license_level}}</span></td>
            <td class="text-xs-left"><span class="subheading">{{ props.item.sp }}</span></td>
            <td class="text-xs-left"><span class="subheading">{{ props.item.applied_string }}</span></td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-card-text>
              <p v-if="props.item.description" v-html="props.item.description" class="description-text" />
              <p v-if="props.item.effect" v-html="props.item.effect" class="pl-2"/>
              <v-layout class="mt-2">
                <tag v-for="(tag, index) in props.item.tags" :key="tag.id + index" :id="tag.id" :val="tag.val"/>
              </v-layout>
            </v-card-text>
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
  import Tag from '../../UI/Tag'

  export default {
    name: 'mod-table',
    components: { Tag },
    props: {
      current_equip: Object,
      free_sp: Number,
      weapon_type: String
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
        {text: 'Mod', align: 'left', value: 'name'},
        {text: 'Source', align: 'left', value: 'source'},
        {text: 'License', align: 'left', value: 'license'},
        {text: 'SP Cost', align: 'left', value: 'sp'},
        {text: 'Applied To', align: 'left', value: 'sp'}
      ]
    }),
    computed: {
      mods: function () {
        var vm = this

        var allMods = vm.$store.getters.getItemCollection('WeaponMods')

        var i = allMods.filter(x => x.source)

        if (!vm.showLocked) {
          i = i.filter(x => x.source === 'GMS' || (this.pilot.licenses.find(y => y.name === x.license) &&
            this.pilot.licenses.find(y => y.name === x.license).level >= x.license_level))
        }

        if (!vm.showOverSp) {
          // if an item is currently equipped to this slot, look it up to find sp value for exchange
          var totalFreeSp = this.current_equip ? this.free_sp + this.current_equip.sp || 0 : this.free_sp
          i = i.filter(x => x.sp <= totalFreeSp)
        }

        // filter already equipped
        if (this.current_equip) i = i.filter(x => x.id !== this.current_equip.id)

        // filter by applied_to
        i = i.filter(x => x.applied_to.includes(this.weapon_type))

        if (vm.search) i = i.filter(x => x.name.toLowerCase().includes(vm.search.toLowerCase()))

        return i
      },
      pilot: function () {
        return this.$store.getters.getPilot
      }
    },
    methods: {
      item: function (id) {
        return this.$store.getters.getItemById('WeaponMods', id)
      },
      remove: function () {
        this.$emit('remove')
      },
      select: function (item) {
        this.$emit('select', item)
      },
      isLocked: function (name, level) {
        if (!name) return false
        return !((this.pilot.licenses.find(y => y.name === name) && this.pilot.licenses.find(y => y.name === name).level >= level))
      },
      isOverSp: function (sp) {
        var totalFreeSp = this.current_equip ? this.free_sp + this.current_equip.sp || 0 : this.free_sp
        return sp > totalFreeSp
      }
    }
  }
</script>