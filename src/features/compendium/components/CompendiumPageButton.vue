<template>
  <v-col :cols="cols" :lg="lg" :md="md" :sm="sm">
    <div
      class="mx-2"
      @click="$emit('clicked')"
      @keydown.enter="$emit('clicked')"
      tabindex="0"
    >
      <v-alert variant="outlined" :color="color" prominent dense>
        <v-icon
          slot="prepend"
          class="icn"
          x-large
          :color="`${color} lighten-1`"
          left
        >
          {{ icon }}
        </v-icon>
        <div class="d-inline mt-n1 heading h2 stark--text">{{ name }}</div>
      </v-alert>
    </div>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'CompendiumPageButton',
  props: {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
      default: '',
    },
    cols: {
      type: String,
      required: false,
      default: '',
    },
    lg: {
      type: String,
      required: false,
      default: '',
    },
    md: {
      type: String,
      required: false,
      default: '',
    },
    sm: {
      type: String,
      required: false,
      default: '',
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
};
</script>

<style scoped>
.v-alert {
  filter: brightness(100%);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.v-alert:hover {
  filter: brightness(160%);
}

.icn {
  opacity: 0.7;
  transition: opacity 0.3s ease-in-out;
}

.v-alert:hover > .icn {
  opacity: 1;
  color: rgb(var(--v-theme-stark));
}
</style>
