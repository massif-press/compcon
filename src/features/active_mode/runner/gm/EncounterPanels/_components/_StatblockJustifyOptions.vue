<template>
  <v-row dense
    class="mb-2">
    <v-col>
      <cc-switch :model-value="enableJustify"
        :label="$t('active.fields.justify')"
        @update:model-value="$emit('update:enableJustify', $event)" />
    </v-col>
    <v-col cols="auto">
      <v-slide-x-reverse-transition>
        <div v-if="enableJustify"
          style="width: 300px;">
          <cc-number-field :model-value="lineWidth"
            :label="$t('active.fields.lineWidth')"
            color="primary"
            density="compact"
            size="small"
            type="number"
            variant="outlined"
            max="99999"
            dense
            hide-details
            @update:model-value="$emit('update:lineWidth', $event)" />
        </div>
      </v-slide-x-reverse-transition>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{ enableJustify: boolean; lineWidth: number }>()
defineEmits<{ 'update:enableJustify': [value: boolean]; 'update:lineWidth': [value: number] }>()
</script>
