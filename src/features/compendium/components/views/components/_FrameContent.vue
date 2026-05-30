<template>
  <c-card-base :item="item"
    :small="small"
    :highlighted="highlighted"
    :hover="hover">
    <template #top>
      <v-img v-if="item.DefaultImage"
        :src="item.DefaultImage"
        contain
        lazy
        :height="small ? '175px' : '225px'"
        class="py-2" />
    </template>
    <template #overline>{{ item.MechTypeString }} Frame</template>
  </c-card-base>
</template>

<script setup lang="ts">
import CCardBase from './_cCardBase.vue';

defineOptions({ name: 'FrameCardContent' })

const props = defineProps<{
  item: object
  small?: boolean
  hover?: boolean
  highlighted?: boolean
}>()
</script>
