<template>
  <div
    :class="`py-1 pl-${2 * indent} ${selected ? 'selected-' : ''}${text ? 'text-' : ''}nav`"
    style="cursor: pointer"
    @click="$emit('click')"
  >
    <v-row no-gutters>
      <v-col>
        <div :class="text ? (nested ? '' : 'font-weight-bold') : 'white--text heading h4'">
          <slot />
        </div>
      </v-col>
      <v-col
        v-if="idn"
        cols="auto"
        :class="text ? '' : 'white--text'"
        class="ml-auto pr-1"
        align-self="end"
      >
        <i class="overline">{{ idn }}</i>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'gm-edit-sidebar-button',
  props: {
    selected: { type: Boolean },
    text: { type: Boolean },
    idn: { type: String, required: false, default: '' },
    nested: { type: Boolean },
    indent: { type: Number, required: false, default: 1 },
  },
})
</script>

<style scoped>
.selected-nav {
  background-color: var(--v-secondary-base);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.selected-nav:hover {
  background-color: var(--v-secondary-lighten2);
}

.nav {
  background-color: var(--v-primary-base);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.nav:hover {
  background-color: var(--v-primary-lighten2);
}

.selected-text-nav {
  background-color: rgba(0, 0, 0, 0.1);
  color: var(--v-secondary-base);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.selected-text-nav:hover {
  color: var(--v-secondary-lighten2);
}

.text-nav {
  color: var(--v-text-base);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.text-nav:hover {
  color: var(--v-accent-base);
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
