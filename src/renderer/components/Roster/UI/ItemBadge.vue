<template>
  <div>
    <div @click="showCatalogEntry(item)" :id="`itemBadge_${item.id}`">
      <div v-if="item.data_type === 'frame'"><b-btn variant="success" :class="{lockFade: locked}">{{item.name}}</b-btn></div>
      <div v-else-if="item.data_type === 'weapon'"><b-btn variant="warning" :class="{lockFade: locked}">{{item.name}}</b-btn></div>
      <div v-else><b-btn variant="primary" :class="{lockFade: locked}">{{item.name}}</b-btn></div>
    </div>
    <item-detail-popover :target="`itemBadge_${item.id}`" :item="item" />
  </div>
</template>

<script>
  import ItemDetailPopover from './ItemDetailPopover'

  export default {
    name: 'item-badge',
    props: [ 'item', 'locked' ],
    components: { ItemDetailPopover },
    methods: {
      showCatalogEntry (item) {
        console.info('TODO: on click, this should open (or navagate to) the catalog and load the item in question')
      }
    }
  }
</script>

<style scoped>
 .lockFade {
   cursor: not-allowed;
   opacity: 75;
 }
</style>
