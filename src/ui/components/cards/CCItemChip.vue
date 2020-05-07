<template>
  <v-chip label outlined :color="item.Color" dark>
    <v-menu open-on-hover open-delay="500ms" offset-y top close-on-click close-on-content-click>
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <v-icon>cci-{{ $_.kebabCase(item.ItemType) }}</v-icon>
          <span class="heading h3 px-2 mt-n1">{{ item.Name }}</span>
        </div>
      </template>
      <cc-item-card :item="item" readonly active />
    </v-menu>
  </v-chip>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-item-chip',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
