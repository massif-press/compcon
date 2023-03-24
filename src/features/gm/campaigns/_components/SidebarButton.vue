<template>
  <div
    :class="`py-1 pl-${2 * indent} ${selected ? 'selected-' : ''}${
      text ? 'text-' : ''
    }nav`"
    style="cursor: pointer"
    @click="$emit('click')"
  >
    <v-row no-gutters>
      <v-col>
        <div
          :class="
            text ? (nested ? '' : 'font-weight-bold') : 'white--text heading h4'
          "
        >
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
export default {
  name: 'gm-edit-sidebar-button',
  props: {
    selected: { type: Boolean },
    text: { type: Boolean },
    idn: { type: String, required: false, default: '' },
    nested: { type: Boolean },
    indent: { type: Number, required: false, default: 1 },
  },
};
</script>

<style scoped>
.selected-nav {
  background-color: rgb(var(--v-theme-secondary));
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.selected-nav:hover {
  background-color: rgb(var(--v-theme-secondary-lighten2));
}

.nav {
  background-color: rgb(var(--v-theme-primary));
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.nav:hover {
  background-color: rgb(var(--v-theme-primary-lighten2));
}

.selected-text-nav {
  background-color: rgba(0, 0, 0, 0.1);
  color: rgb(var(--v-theme-secondary));
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.selected-text-nav:hover {
  color: rgb(var(--v-theme-secondary-lighten2));
}

.text-nav {
  color: rgb(var(--v-theme-text));
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.text-nav:hover {
  color: rgb(var(--v-theme-accent));
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
