<template>
  <div v-show="items.length > 0">
    <div
      v-if="title"
      class="heading h3 text-accent pb-2"
    >
      {{ title }}
    </div>
    <div
      v-else
      style="height: 8px"
    />
    <v-item-group
      :model-value="modelValue"
      @update:model-value="$emit('update:model-value', $event)"
      :mandatory="mandatory"
      :multiple="multiple"
    >
      <v-row
        justify="space-around"
        align="stretch"
      >
        <v-col
          v-for="i in items"
          :key="i.key"
          style="min-width: 16vw"
        >
          <v-item
            :value="i"
            v-slot="{ isSelected, toggle }"
          >
            <v-card
              :color="isSelected ? 'accent' : ''"
              class="d-flex align-center justify-center text-center"
              height="100%"
              variant="tonal"
              :ripple="false"
              @click="toggle"
            >
              <v-card-text>
                <v-icon
                  v-if="i.icon"
                  size="60"
                >
                  {{ i.icon }}
                </v-icon>
                <br v-if="i.icon" />
                <div :class="`font-weight-bold ${isSelected && 'text-white'}`">
                  {{ i.title }}
                </div>
              </v-card-text>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-item-group>
  </div>
</template>

<script setup lang="ts">
  import type { PrintOption } from '@/ui/print/types'

  defineProps<{
    modelValue: PrintOption | PrintOption[]
    title?: string
    items: PrintOption[]
    mandatory?: boolean
    multiple?: boolean
  }>()
  defineEmits<{ 'update:model-value': [value: any] }>()
</script>
