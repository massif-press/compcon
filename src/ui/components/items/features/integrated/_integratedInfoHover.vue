<template>
  <v-menu open-on-hover bottom offset-y>
    <template v-slot:activator="{ on }">
      <v-chip :color="item.Color" v-on="on">
        <span class="white--text">
          <v-icon left dark>{{ item.Icon }}</v-icon>
          {{ item.Name }}
        </span>
      </v-chip>
    </template>
    <v-card flat tile>
      <v-toolbar dense flat :color="item.Color" class="white--text">
        <v-icon left large dark>{{ item.Icon }}</v-icon>
        <span class="heading h3">{{ item.Name }}</span>
      </v-toolbar>
      <v-card-text class="mt-n3">
        <integrated-info-base :item="item" />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
import integratedInfoBase from './_integratedInfoBase.vue'

export default Vue.extend({
  name: 'integrated-info-hover',
  components: { integratedInfoBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
