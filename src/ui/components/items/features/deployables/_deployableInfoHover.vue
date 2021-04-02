<template>
  <v-menu open-on-hover bottom offset-y>
    <template v-slot:activator="{ on }">
      <v-chip :color="deployable.Color" v-on="on">
        <span class="white--text">
          <v-icon left dark>{{ deployable.Icon }}</v-icon>
          {{ deployable.Name }}
        </span>
      </v-chip>
    </template>
    <v-card flat tile>
      <v-toolbar dense flat :color="deployable.Color" class="white--text">
        <v-icon left large dark>{{ deployable.Icon }}</v-icon>
        <span class="heading h3">{{ deployable.Name }}</span>
      </v-toolbar>
      <v-card-text class="mt-n3">
        <deployable-info-base :action="action" />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
import deployableInfoBase from './_deployableInfoBase.vue'

export default Vue.extend({
  name: 'action-hover',
  components: { deployableInfoBase },
  props: {
    deployable: {
      type: Object,
      required: true,
    },
  },
})
</script>
