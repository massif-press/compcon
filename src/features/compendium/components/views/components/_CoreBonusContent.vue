<template>
  <c-card-base :item="item"
    :small="small"
    :highlighted="highlighted"
    :hover="hover">
    <template #top>
      <v-row no-gutters
        justify="space-around"
        align="start">
        <v-col cols="auto">
          <div class="pa-4 text-text">{{ item.Effect }}</div>
        </v-col>
      </v-row>
    </template>
  </c-card-base>
</template>

<script setup lang="ts">
import CCardBase from './_cCardBase.vue';

defineOptions({ name: 'CoreBonusCardContent' })

const props = defineProps<{
  item: object
  small?: boolean
  hover?: boolean
  highlighted?: boolean
}>()
</script>
