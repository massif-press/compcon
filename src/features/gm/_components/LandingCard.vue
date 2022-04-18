<template>
  <v-col :cols="cols">
    <v-hover v-slot="{ hover }" style="cursor: pointer">
      <v-card flat outlined class="mx-auto" :to="to">
        <v-img :aspect-ratio="ratio" :src="`../../../../static/img/misc/${img}`">
          <v-fade-transition>
            <div
              v-if="hover"
              class="d-flex text-center primary darken-2 v-card--reveal heading h2 white--text"
              style="height: 100%"
            >
              {{ description }}
            </div>
          </v-fade-transition>
        </v-img>
        <v-card-text class="py-2 text-center heading h2" style="position: relative">
          <span :class="hover ? 'primary--text' : ''">{{ name }}</span>
        </v-card-text>
      </v-card>
    </v-hover>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'gm-landing-card',
  props: {
    to: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: String, required: true },
    cols: { type: [String, Number], required: false, default: '' },
    ratio: { type: Number, required: false, default: 1 },
    // dark: { type: Boolean },
  },
})
</script>

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.85;
  position: absolute;
  width: 100%;
}
</style>