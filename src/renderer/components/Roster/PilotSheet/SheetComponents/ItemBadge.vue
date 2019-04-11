<template>
  <div>
    <v-menu bottom :close-on-content-click="false" nudge-bottom=40 nudge-right=5 lazy>
      <div slot="activator" :id="`itemBadge_${item.id}`">
        <div v-if="item.data_type === 'frame'">
          <v-btn outline :color="locked ? 'indigo lighten-3' : 'deep-purple'" >"{{item.name}}" Frame</v-btn>
        </div>
        <div v-else-if="item.data_type === 'weapon'">
          <v-btn outline :color="locked ? 'blue-grey darken-3' : 'primary'" >{{item.name}}</v-btn>
        </div>
        <div v-else>
          <v-btn  outline :color="locked ? 'teal lighten-3' : 'teal'">{{item.name}}</v-btn>
        </div>
      </div>
      <item-card :itemData="item" popup />
    </v-menu>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {ItemTag, ItemCard} from '@/components/UI'

  export default Vue.extend({
   name: 'item-badge',
    props: {
      item: Object,
      locked: Boolean
    },
    components: { ItemTag, ItemCard }
  })
</script>