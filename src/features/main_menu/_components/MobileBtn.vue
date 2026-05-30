<template>
  <v-col :cols="landscape ? '' : 6">
    <div class="pip bg-accent" />
    <v-card
      variant="tonal"
      tile
      class="text-center"
      height="100%"
      style="clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px)"
      @click="to ? $router.push(to) : $emit('clicked')">
      <div
        class="d-flex justify-center align-center"
        style="height: 90%; container-type: inline-size">
        <div class="primary py-4">
          <v-icon color="accent" size="100cqw">
            {{ icon }}
          </v-icon>
          <div class="heading no-wrap" style="font-size: 13cqw">
            {{ title }}
          </div>
        </div>
      </div>
    </v-card>
  </v-col>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
const router = useRouter()

const _display = useDisplay()

defineOptions({ name: 'mobile-btn' })

const props = withDefaults(defineProps<{
  to?: string
  title: string
  icon: string
  disabled?: boolean
  loading?: boolean
}>(), {
  to: ''
})

const landscape = computed(() => {
      return _display.smAndUp.value;
    })
</script>

<style scoped>
.pip {
  width: 17px;
  height: 17px;
  position: absolute;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  transition: filter 0.2s ease-in-out;
}
</style>
