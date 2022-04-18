<template>
  <page-base :item="item">
    {{ item }}
    {{ typeof item }}
    <v-divider class="my-2" />
    <v-row>
      <v-col>
        <v-btn @click="item.AddBeat()">add beat</v-btn>
      </v-col>
    </v-row>
  </page-base>
</template>

<script lang="ts">
import Vue from 'vue'
import PageBase from './_components.vue/PageBase.vue'

export default Vue.extend({
  name: 'campaign-mission-page',
  components: { PageBase },
  props: {
    item: { type: Object, required: true },
  },
})
</script>
