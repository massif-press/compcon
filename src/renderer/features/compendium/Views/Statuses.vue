<template>
  <sidebar-array-view
    title="STATUSES AND CONDITIONS"
    :array="statuses"
    icon="cci-difficulty"
    name-key="ID"
    sub-key="type"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import SidebarArrayView from '../UI/SidebarArrayView.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

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
    const compendium = getModule(CompendiumStore, this.$store)
    this.statuses = compendium.Statuses.map(x => ({
      ID: x.name,
      type: x.type,
      Description: listString(x.effects),
    }))
  },
})
</script>
