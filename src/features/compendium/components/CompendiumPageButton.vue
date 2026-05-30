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

<script setup lang="ts">
import { useMobile } from '@/composables/useMobile'
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
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
  })

const { mobile, portrait } = useMobile()
</script>

<style scoped>
@import './compendium-card-base.css';

.v-card:hover {
  filter: brightness(140%) saturate(2) hue-rotate(40deg);
}

.top-element:hover .pip {
  opacity: 1;
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}
</style>
