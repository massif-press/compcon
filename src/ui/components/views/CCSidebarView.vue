<template>
  <v-container fluid class="mt-n3">
    <v-row dense no-gutters>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" style="width: 12vw; position: fixed" class="pt-2">
        <slot name="alt" />
        <v-list
          dense
          class="side-fixed"
          :style="popup ? `top: 65px; padding-bottom: 65px;` : `top: 125px; padding-bottom: 65px;`"
        >
          <slot name="sidebar" />
        </v-list>
      </v-col>
      <v-col
        :style="$vuetify.breakpoint.mdAndUp ? 'margin-left: 12vw' : ''"
        :class="$vuetify.breakpoint.mdAndUp ? 'pl-7 mr-7' : ''"
      >
        <slot />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'cc-sidebar-view' })
export default class CCSidebarView extends Vue {
  @Prop({ type: Boolean, required: false })
  popup?: boolean
}
</script>

<style scoped>
.side-fixed {
  height: calc(100vh - 70px);
  overflow-y: scroll;
}
</style>
