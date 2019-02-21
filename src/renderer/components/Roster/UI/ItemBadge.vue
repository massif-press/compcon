<template>
  <div>
    <v-menu bottom :close-on-content-click="false" nudge-bottom=40 nudge-right=5 lazy>
      <div slot="activator" :id="`itemBadge_${item.id}`">
        <div v-if="item.data_type === 'frame'"><v-btn :color="locked ? 'green lighten-3' : 'success'" dark>"{{item.name}}" Frame</v-btn></div>
        <div v-else-if="item.data_type === 'weapon'"><v-btn :color="locked ? 'lime lighten-2' : 'lime darken-2'" dark>{{item.name}}</v-btn></div>
        <div v-else><v-btn dark :color="locked ? 'teal lighten-3' : 'teal'">{{item.name}}</v-btn></div>
      </div>
      <item-card :itemData="item" />
    </v-menu>
  </div>
</template>

<script>
  import Tag from './Tag'
  import ItemCard from './ItemCard'

  export default {
    name: 'item-badge',
    props: [ 'item', 'locked' ],
    components: { Tag, ItemCard }
  }
</script>