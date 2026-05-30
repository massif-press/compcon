<template>
  <v-col :cols="cols">
    <cc-panel :title="attr" density="no-gutters">
      <div class="pa-1">
        <v-row dense justify="center" align="center">
          <v-col cols="auto" class="pr-2">
            <v-icon size="32" :icon="icon" />
          </v-col>
          <v-col cols="auto" class="text-center">
            <div class="heading text-center" style="font-size: 34px; line-height: 0">
              {{ val }}
            </div>
          </v-col>
        </v-row>
      </div>
    </cc-panel>
  </v-col>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  cols?: number | string
  attr: string
  icon: string
  val: string | number
}>(), {
  cols: 4
})
</script>
