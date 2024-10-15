<template>
  <cc-dialog no-dismiss :color="action.Color" large>
    <span slot="button" class="white--text" style="width: 100%">
      <v-icon dark>{{ action.Icon }}</v-icon>
      <span v-if="$vuetify.breakpoint.mdAndDown">
        {{ action.Name.length > 30 ? action.Name.substring(0, 20) + '…' : action.Name }}
      </span>
      <span v-else>
        {{ action.Name }}
      </span>
    </span>

    <span slot="title">
      <v-icon left large dark>{{ action.Icon }}</v-icon>
      {{ action.Name }}
    </span>
    <v-chip slot="title-items" color="white" class="stat-text mt-4 mr-6" outlined label>
      {{ action.Frequency.ToString() }}
    </v-chip>

    <action-base :action="action" :displayDescription="true" />
  </cc-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionBase from './_actionBase.vue'

export default Vue.extend({
  name: 'action-popup',
  components: { ActionBase },
  props: {
    action: {
      type: Object,
      required: true,
    },
    displayDescription: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
})
</script>
