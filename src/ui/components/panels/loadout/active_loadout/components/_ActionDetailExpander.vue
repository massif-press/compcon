<template>
  <div>
    <p
      v-if="!action.Trigger"
      class="text--text body-text mb-2"
      v-html-safe="action.Terse ? action.Terse : action.Detail"
    />
    <div v-else>
      <div v-if="action.Frequency.ToString() !== 'Unlimited'">
        <div class="overline mb-n3">Frequency</div>
        <div class="ml-3 body-text stark--text" v-html-safe="action.Frequency.ToString()" />
      </div>
      <div class="overline mb-n3">Trigger</div>
      <div class="ml-3 body-text stark--text" v-html-safe="action.Trigger" />
      <div class="overline mb-n3">Effect</div>
      <div class="ml-3 body-text stark--text" v-html-safe="action.Detail" />
    </div>
    <div
      v-if="action.Terse"
      class="sidebar-box ml-2"
      :style="`max-height:${expanded ? '100%' : '40px;'}`"
    >
      <div class="panel clipped py-1 px-2">
        <div class="caption accent--text mt-1">
          COMPENDIUM ENTRY
          <cc-slashes />
          <b>{{ action.Name }}</b>
        </div>
        <p class="pb-1 mb-0" v-html-safe="action.Detail" />
      </div>
      <p class="read-more">
        <v-btn
          icon
          :class="`fadeSelect ${expanded ? 'mb-n2' : 'mb-n6'}`"
          style="background-color: var(--v-stark-panel-base)"
          @click="expanded = !expanded"
        >
          <v-icon color="accent">mdi-chevron-double-{{ expanded ? 'up' : 'down' }}</v-icon>
        </v-btn>
      </p>
      <div v-if="expanded" style="min-height: 40px" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'action-detail-expander',
  props: {
    action: { type: Object, required: true },
  },
  data: () => ({
    expanded: false,
  }),
})
</script>

<style scoped>
.sidebar-box {
  position: relative;
  overflow: hidden;
  transition: max-heighe ease-in-out 0.2s;
}

.sidebar-box .read-more {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  margin: 0;
  padding: 20px 0;

  background-image: linear-gradient(to bottom, transparent, var(--v-background-base));
}
</style>
