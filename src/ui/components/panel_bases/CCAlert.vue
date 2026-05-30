<template>
  <v-card :style="[
    closed && 'display:none',
    `border-color: rgb(var(--v-theme-${borderColor || color}))!important`,
    `border-left: 8px solid rgb(var(--v-theme-${borderColor || color})`,
  ]"
    style="corner-shape: bevel; border-radius: 0; border-bottom-right-radius: 24px"
    :color="color"
    flat>
    <v-row no-gutters>
      <v-col cols="auto"
        v-if="icon && prominent && !mobile">
        <v-icon size="60"
          class="mt-2 ml-2"
          :color="iconColor">{{ icon }}</v-icon>
      </v-col>
      <v-col>
        <div v-if="title"
          class="heading h3 px-4">
          <v-row dense
            align="center">
            <v-col cols="auto"
              v-if="icon && (!prominent || mobile)">
              <v-icon :icon="icon" />
            </v-col>
            <v-col cols="auto">
              <slot name="title">
                {{ title }}
              </slot>
            </v-col>
          </v-row>
          <v-divider class="mt-1" />
        </div>
        <v-card-text :class="compact ? 'py-1' : 'py-2'">
          <slot />
        </v-card-text>
      </v-col>
      <v-col v-if="closeable"
        cols="auto">
        <v-btn size="x-small"
          icon="mdi-close"
          variant="text"
          @click.stop="closed = true" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'

const { smAndDown: mobile } = useDisplay()

interface Props {
  color?: string
  title?: string | boolean
  icon?: string | boolean
  prominent?: boolean
  closeable?: boolean
  iconColor?: string
  density?: string
  borderColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'panel',
  title: '',
  icon: '',
  prominent: false,
  iconColor: '',
  density: '',
  borderColor: '',
})

const closed = ref(false)
const compact = computed(() => props.density === 'compact')
</script>
