<template>
  <gm-collection-view
    title="Locations"
    item-type="Location"
    :items="locations"
    :groupings="['Campaign', 'Labels']"
    :sortings="['Name']"
    @add-new="$router.push('locations/edit/new')"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import GmCollectionView from '../_views/GMCollectionView.vue'
export default Vue.extend({
  name: 'locations-roster',
  components: { GmCollectionView },
  computed: {
    locations() {
      return this.$store.getters['location/getLocations']
    },
  },
})
</script>
