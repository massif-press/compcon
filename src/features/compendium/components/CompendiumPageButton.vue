<template>
  <v-col :style="$vuetify.display.smAndDown ? 'min-width: 50vw' : 'min-width: 30vw'">
    <div class="top-element">
      <div :class="`pip bg-${color}`" />
      <v-card
        variant="tonal"
        :color="color"
        :class="mobile ? 'px-3 py-1' : 'pa-2'"
        tile
        @click="$router.push(to)"
        style="clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px)"
        :disabled="disabled">
        <v-row align="center">
          <v-col cols="auto">
            <v-icon class="icn" :size="mobile ? 40 : 50" :color="`${color} lighten-1`">
              {{ icon }}
            </v-icon>
          </v-col>
          <v-col>
            <div :class="mobile ? 'h3' : 'h2'" class="heading text-stark">
              {{ name }}
            </div>
          </v-col>
        </v-row>
      </v-card>
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
    disabled: {
      type: Boolean,
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>

<style scoped>
.v-card {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.v-card:hover {
  filter: brightness(140%) saturate(2) hue-rotate(40deg);
}

.icn {
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;
}

.pip {
  width: 17px;
  height: 17px;
  position: absolute;
  opacity: 0.5;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  transition: filter 0.2s ease-in-out;
}

.top-element:hover .pip {
  opacity: 1;
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}
</style>
