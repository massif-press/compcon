<template>
  <div>
    <v-menu bottom :close-on-content-click="false" nudge-bottom=40 nudge-right=5 lazy>
      <div slot="activator" :id="`itemBadge_${item.id}`">
        <div v-if="item.data_type === 'frame'"><v-btn outline :color="locked ? 'indigo lighten-3' : 'deep-purple'" >"{{item.name}}" Frame</v-btn></div>
        <div v-else-if="item.data_type === 'weapon'"><v-btn outline :color="locked ? 'blue-grey darken-3' : 'primary'" >{{item.name}}</v-btn></div>
        <div v-else><v-btn  outline :color="locked ? 'teal lighten-3' : 'teal'">{{item.name}}</v-btn></div>
      </div>
      <item-card :itemData="item" popup />
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