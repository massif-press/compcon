<template>
  <sidebar-array-view
    title="STATUSES AND CONDITIONS"
    :array="statuses"
    icon="cci-difficulty"
    nameKey="ID"
    subKey="type"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import SidebarArrayView from '../UI/SidebarArrayView.vue'

function listString(arr) {
  return '<ul>' + arr.map(x => `<li>${x}</li>`).join('') + '</ul>'
}

export default Vue.extend({
  name: 'statuses',
  components: { SidebarArrayView },
  data: () => ({
    statuses: [],
  }),
  created() {
    this.statuses = this.$store.getters
      .getItemCollection('Statuses')
      .map(x => ({ ID: x.name, type: x.type, Description: listString(x.effects) }))
  },
})
</script>
