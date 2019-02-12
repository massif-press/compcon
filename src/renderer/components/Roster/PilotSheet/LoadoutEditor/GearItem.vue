<template>
  <b-card no-body>
    <v-layout>
      <v-flex xs2>
        <v-btn v-if="empty" block @click="clicked"> Equip {{ itemType }}</v-btn>
        <v-btn v-else block @click="clicked">{{ itemType }}</v-btn>
      </v-flex>
      <v-flex>
        <div v-if="empty">
          ////
        </div>
        <div v-else>
          <v-btn block v-b-toggle="item.id + 'collapse'" :key="item.id">
            <span class="float-left">{{itemData.name}} </span> 
            <span class="float-right">{{itemData.source}}</span>
          </v-btn>
            <b-collapse :id="item.id + 'collapse'" class="mt-2">
              <gear-card :itemData="itemData"/>
            </b-collapse>
        </div>
      </v-flex>
    </v-layout>
  </b-card>
</template>

<script>
import GearCard from './GearCard'

export default {
  name: 'gear-item',
  components: { GearCard },
  props: {
    'item': Object,
    'empty': Boolean,
    'itemType': String
  },
  computed: {
    itemData () {
      if (this.empty) return {}
      return this.$store.getters.getItemById('PilotGear', this.item.id)
    }
  },
  methods: {
    clicked () {
      this.$emit('clicked')
    }
  }
}
</script>
