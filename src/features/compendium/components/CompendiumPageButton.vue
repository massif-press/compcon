<template>
  <v-col :cols="cols" lg="4" md="6" sm="12">
    <v-card variant="tonal" :color="color" class="pa-2" @click="$router.push(to)">
      <v-row align="center">
        <v-col cols="auto">
          <v-icon class="icn" size="50" :color="`${color} lighten-1`">
            {{ icon }}
          </v-icon>
        </v-col>
        <v-col>
          <div class="heading h2 text-stark">
            {{ name }}
          </div>
        </v-col>
      </v-row>
    </v-card>
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
    to: {
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
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
};
</script>

<style scoped>
.v-card {
  filter: brightness(100%);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.v-card:hover {
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
