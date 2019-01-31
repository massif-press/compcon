<template>
  <b-card no-body>
    <b-row>
      <b-col cols=2>
        <b-btn block v-b-modal.pilotGearSelectorModal>{{itemData.type.charAt(0).toUpperCase() + itemData.type.slice(1)}}</b-btn>
        </b-col>
      <b-col>
        <b-btn block v-b-toggle="item.id + 'collapse'">
          <span class="float-left">{{itemData.name}} </span> 
          <span class="float-right">{{itemData.source}}</span>
        </b-btn>
          <b-collapse :id="item.id + 'collapse'" class="mt-2">
            <b-card>
                <p v-if="itemData.description" v-html="itemData.description" />
                <p v-if="itemData.damage" v-html="`${itemData.damage} Damage // ${itemData.range}`" />
                <p v-if="itemData.armor" v-html="`+ ${itemData.armor} Armor // E-Defense: ${itemData.edef} // Evasion: ${itemData.evasion}`" />
                <p v-if="itemData.speed" v-html="`Speed ${itemData.speed}`" />
                <p v-if="itemData.uses" v-html="`${itemData.uses} Uses`" />
                <p v-if="itemData.effect" v-html="itemData.effect" />
                <p v-html="`Rarity ${itemData.rarity}`" />
            </b-card>
          </b-collapse>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  name: 'gear-item',
  props: [
    'item'
  ],
  computed: {
    itemData () {
      return this.$store.getters.getItemById('PilotGear', this.item.id)
    }
  }
}
</script>
