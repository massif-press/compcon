<template>
  <v-col v-if="controller.CanActivate('protocol')"
    cols="auto">
    <v-chip color="protocol"
      class="ml-2"
      :size="large ? 'large' : 'small'"
      :tile="large"
      prepend-icon="cc:protocol"
      variant="flat">
      Protocol
    </v-chip>
  </v-col>
  <v-col v-if="controller.CanActivate('full')"
    cols="auto">
    <v-chip color="action--full"
      prepend-icon="mdi-hexagon-slice-6"
      class="ml-2"
      :size="large ? 'large' : 'small'"
      :tile="large"
      variant="flat">
      Full Action
    </v-chip>
  </v-col>
  <v-col v-else-if="controller.CanActivate('quick')"
    cols="auto">
    <v-chip color="action--quick"
      prepend-icon="mdi-hexagon-slice-3"
      class="ml-2"
      :size="large ? 'large' : 'small'"
      :tile="large"
      variant="flat">
      Quick Action
    </v-chip>
  </v-col>
</template>

<script setup lang="ts">
defineOptions({ name: 'EndRoundActionChips' })

defineProps<{
  controller: any
  large?: boolean
}>()
</script>
