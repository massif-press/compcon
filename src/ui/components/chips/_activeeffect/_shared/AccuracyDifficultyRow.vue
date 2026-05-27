<template>
  <v-row align="center"
    no-gutters
    class="heading h3">
    <v-col cols="auto">1d20</v-col>
    <v-col cols="auto"
      class="mx-2">+</v-col>
    <v-col cols="auto">
      <v-text-field :model-value="bonus"
        density="compact"
        variant="outlined"
        type="number"
        hide-spin-buttons
        flat
        max-width="80"
        hide-details
        tile
        @update:model-value="emit('update:bonus', Number($event))" />
    </v-col>
    <v-col cols="auto"
      class="mx-2">
      <cc-slashes />
    </v-col>
    <v-col cols="auto">
      <v-text-field :model-value="modelValue"
        density="compact"
        variant="outlined"
        class="my-2"
        type="number"
        hide-spin-buttons
        flat
        hide-details
        tile
        max-width="140"
        @update:model-value="emit('update:modelValue', Number($event))">
        <template #prepend>
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-icon class="mr-n3"
                v-bind="props"
                size="x-large"
                color="accent"
                :icon="modelValue > 0 ? 'cc:accuracy' : 'cc:difficulty'" />
            </template>
          </v-tooltip>
        </template>
        <template #prepend-inner>
          <v-btn flat
            tile
            icon
            size="x-small"
            class="ml-n2"
            @click="emit('update:modelValue', modelValue - 1)">
            <v-icon size="20"
              icon="mdi-minus" />
          </v-btn>
        </template>
        <template #append-inner>
          <v-btn flat
            tile
            icon
            size="x-small"
            class="mr-n2"
            @click="emit('update:modelValue', modelValue + 1)">
            <v-icon size="20"
              icon="mdi-plus" />
          </v-btn>
        </template>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: number
  bonus: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'update:bonus': [value: number]
}>()
</script>
