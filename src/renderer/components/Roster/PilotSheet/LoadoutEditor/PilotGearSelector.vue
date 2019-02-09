<template>
  <div>
    <b-modal v-model="modalShow" id="pilotGearSelectorModal" no-ok centered no-close-on-backdrop hide-header hide-footer size="xl">
    <item-table :itemType="itemType" v-on:select-item="stageEquip($event)" />
    <hr>
    <div>
      <b-container fluid>
        <b-row>
          <b-col cols=10>
            <b-btn size="lg" block :disabled="!itemSelected" @click="()=>equipItem()">Equip</b-btn>
          </b-col>
          <b-col>
            <b-btn size="sm" block class="float-right" variant="primary" @click="modalShow = false">Cancel</b-btn>
          </b-col>
        </b-row>
      </b-container>
    </div>
    </b-modal>
  </div>
</template>

<script>
  import GearCard from './GearCard'
  import ItemTable from './ItemTable'

  export default {
    name: 'selector-modal',
    components: { GearCard, ItemTable },
    props: ['loadoutIndex', 'itemIndex', 'itemType'],
    data: () => ({
      modalShow: false,
      itemSelected: false,
      stagedItem: null
    }),
    methods: {
      equipItem () {
        var attr = this.itemType === 'webbing'
          ? [ 'loadouts', this.loadoutIndex, 'items', 'webbing' ]
          : [ 'loadouts', this.loadoutIndex, 'items', this.itemType, this.itemIndex ]
        this.$store.dispatch('editPilot', {
          attr: attr,
          val: {
            id: this.stagedItem.id
          }
        })
        this.modalShow = false
        this.$parent.refresh()
      },
      show () {
        this.modalShow = true
      },
      stageEquip (item) {
        this.itemSelected = true
        this.stagedItem = item
      }
    }
  }
</script>
