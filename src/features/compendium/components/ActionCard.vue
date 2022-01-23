<template>
  <v-col lg="4" md="6" xs="12">
    <cc-titled-panel
      clickable
      :title="`${action.Name}${exclusive}`"
      :icon="action.Icon"
      :color="action.Color"
      style="height:100%"
      @click="$refs.dialog.show()"
    >
      <v-card-text class="text-left py-1">
        <p v-html-safe="action.Terse" class="body-text mb-1 pa-2" />
      </v-card-text>
    </cc-titled-panel>
    <cc-solo-dialog
      ref="dialog"
      :title="`${action.Name}${exclusive}`"
      :icon="action.Icon"
      :color="action.Color"
      no-actions
      width="80vw"
    >
      <v-container>
        <p v-html-safe="action.Detail" class="body-text text--text mb-1 mt-2" />
        <div class="overline subtle--text">OPTIONS</div>
        <v-row no-gutters justify="center">
          <v-col
            v-for="(a, i) in action.SubActions"
            :key="`${action.Name}_action_${i}`"
            cols="auto"
          >
            <cc-action :action="a" :panel="false" class="ma-2" />
          </v-col>
        </v-row>
      </v-container>
    </cc-solo-dialog>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'action-card',
  props: {
    action: {
      type: Object,
      required: true,
    },
    downtime: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    exclusive() {
      if (this.action.IsPilotAction && !this.action.IsMechAction) return ' (Pilot Only)'
      return ''
    },
  },
})
</script>
