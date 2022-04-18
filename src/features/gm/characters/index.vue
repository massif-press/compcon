<template>
  <gm-collection-view
    title="Characters"
    item-type="Character"
    :items="characters"
    @add-new="$router.push('characters/edit/new')"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import GmCollectionView from '../_views/GMCollectionView.vue'

export default Vue.extend({
  name: 'characters-roster',
  components: { GmCollectionView },
  computed: {
    characters() {
      return this.$store.getters['character/getCharacters']
    },
  },
})
</script>
