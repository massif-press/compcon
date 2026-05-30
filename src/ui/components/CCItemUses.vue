<template>
  <div class="mt-n2">
    <v-btn
      v-for="(n, index) in max"
      :key="`use-${index}`"
      class="d-inline my-0 mx-n1 pa-0"
      icon
      size="small"
      variant="plain"
      :large="large"
      :color="color"
      @click.stop="set(n)"
    >
      <v-icon
        :size="small ? '20' : large ? '30' : '25'"
        :icon="n <= current ? fullIcon : emptyIcon"
      />
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  small?: boolean
  large?: boolean
  emptyIcon?: string
  fullIcon?: string
  color?: string
  item: object
  bonus?: number
}>(), {
  small: false,
  large: false,
  emptyIcon: 'mdi-hexagon-outline',
  fullIcon: 'mdi-hexagon-slice-6',
  color: 'primary',
  bonus: 0
})

const max = computed(() => {
      return props.item.getTotalUses(props.bonus);
    })
const current = computed(() => {
      return props.item.Uses;
    })

function set(val) {
      if (val > current.value) props.item.Uses = props.item.Uses + 1;
      else props.item.Uses = props.item.Uses - 1;
    }
</script>
