<template>
  <v-card flat>

    <!-- Armor -->
    <v-container fluid>
          <v-toolbar color="white" class="mt-5 pt-1" >
        <v-autocomplete flat v-model="search" :items="gearItems" clearable hide-details hide-selected item-text="name" item-value="name" label="Search..." solo />
    </v-toolbar>
      <v-card>
        <v-data-table :headers="itemType === 'armor' ? armor_headers : itemType === 'weapon' ? weapon_headers : gear_headers" 
          :items="gearItems" :expand="true" item-key="id" hide-actions>
          <template slot="items" slot-scope="props">
            <tr v-if="props.item.type === 'armor'" @click="props.expanded = !props.expanded">
              <td style="padding: 0!important;"><v-btn color="primary" small @click.stop="select(props.item)" class="p-0 m-0">equip</v-btn></td>
              <td><span class="subheading">{{ props.item.name }}</span></td>
              <td class="text-xs-center"><span class="subheading">+{{ props.item.armor }}</span></td>
              <td class="text-xs-center"><span class="subheading">+{{ props.item.hp_bonus || 0 }}</span></td>
              <td class="text-xs-center"><span class="subheading">{{ props.item.edef }}</span></td>
              <td class="text-xs-center"><span class="subheading">{{ props.item.evasion }}</span></td>
              <td class="text-xs-center"><span class="subheading">{{ props.item.speed }}</span></td>
            </tr>
            <tr v-else-if="props.item.type === 'weapon'" @click="props.expanded = !props.expanded">
              <td style="padding: 0!important;"><v-btn color="primary" @click="select(props.item)" class="p-0 m-0">equip</v-btn></td>
              <td><span class="subheading">{{ props.item.name }}</span></td>
              <td><span class="subheading"><damage-element small :dmg="props.item.damage" /></span></td>
              <td><span class="subheading"><range-element small :range="props.item.range" /></span></td>
            </tr>
            <tr v-else @click="props.expanded = !props.expanded">
              <td style="padding: 0!important;"><v-btn color="primary" @click="select(props.item)" class="p-0 m-0">equip</v-btn></td>
              <td><span class="subheading">{{ props.item.name }}</span></td>
              <td class="text-xs-center"><span class="subheading">{{ props.item.uses }}</span></td>
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
            <v-card flat>
              <v-card-text><gear-card :itemData="props.item" /></v-card-text>
            </v-card>
          </template>
        </v-data-table>
      </v-card>
      <v-layout justify-space-between class="pt-4">
        <v-flex xs1></v-flex>
        <v-flex shrink>
          <v-btn color="error" flat @click="remove()">Remove Equipped Item</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
  import GearCard from '../../UI/GearCard'
  import RangeElement from '../../UI/RangeElement'
  import DamageElement from '../../UI/DamageElement'

  export default {
    name: 'item-table',
    components: { GearCard, RangeElement, DamageElement },
    props: [ 'itemType' ],
    data: () => ({
      selectedIndex: -1,
      filterText: '',
      sortRule: null,
      search: null,
      searchFilter: null,
      armor_headers: [
        {align: 'left', sortable: false, width: '5vw'},
        {text: 'Item', align: 'left', value: 'name'},
        {text: 'Armor', align: 'center', value: 'armor'},
        {text: 'HP Bonus', align: 'center', value: 'hp_bonus'},
        {text: 'E-Defense', align: 'center', value: 'edef'},
        {text: 'Evasion', align: 'center', value: 'evasion'},
        {text: 'Speed', align: 'center', value: 'speed'}
      ],
      weapon_headers: [
        {align: 'left', sortable: false, width: '5vw'},
        {text: 'Item', align: 'left', value: 'name'},
        {text: 'Damage', align: 'left', value: 'damage'},
        {text: 'Range', align: 'left', value: 'range'}
      ],
      gear_headers: [
        {align: 'left', sortable: false, width: '5vw'},
        {text: 'Item', align: 'left', value: 'name'},
        {text: 'Uses', align: 'center', value: 'uses'}
      ]
    }),
    computed: {
      gearItems: function () {
        var cmp = this
        // filter by type
        var i = cmp.$store.getters.getItemCollection('PilotGear').filter(x => cmp.itemType === x.type)

        if (cmp.search) i = i.filter(x => x.name.toLowerCase().includes(cmp.search.toLowerCase()))

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
      }
    },
    methods: {
      select: function (item) {
        this.$emit('select-item', item)
      },
      remove: function () {
        this.$emit('remove-item', this.itemType)
      }
    }
  }
</script>