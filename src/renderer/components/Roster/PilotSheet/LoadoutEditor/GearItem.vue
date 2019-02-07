<template>
  <b-card no-body>
    <b-row>
      <b-col cols=2>
        <b-btn v-if="empty" block @click="clicked"> Equip {{ itemType }}</b-btn>
        <b-btn v-else block @click="clicked">{{ itemType }}</b-btn>
      </b-col>
      <b-col>
        <div v-if="empty">
          ////
        </div>
        <div v-else>
          <b-btn block v-b-toggle="item.id + 'collapse'" :key="item.id">
            <span class="float-left">{{itemData.name}} </span> 
            <span class="float-right">{{itemData.source}}</span>
          </b-btn>
            <b-collapse :id="item.id + 'collapse'" class="mt-2">
              <gear-card :itemData="itemData"/>
            </b-collapse>
        </div>
      </b-col>
    </b-row>
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
