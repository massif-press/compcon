<template>
  <cc-solo-dialog :model-value="modelValue"
    :close-on-click="false"
    title="Exit Active Mode?"
    :z-index="9999"
    @update:model-value="$emit('update:modelValue', $event)">
    <v-card flat
      tile>
      <div class="text-center text-text ma-2">
        Do you want to save this encounter before exiting?</div>
      <v-divider class="my-3" />
      <v-card-actions class="pa-0">
        <cc-button variant="text"
          size="small"
          @click="$emit('cancel')">Cancel</cc-button>
        <v-spacer />
        <cc-button color="warning"
          size="small"
          variant="text"
          @click="$emit('exit')">Exit Without Saving</cc-button>
        <v-spacer />
        <cc-button color="accent"
          size="small"
          @click="$emit('save')">Save and Exit</cc-button>
      </v-card-actions>
    </v-card>
  </cc-solo-dialog>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
defineEmits<{
  'update:modelValue': [value: boolean]
  'save': []
  'exit': []
  'cancel': []
}>()
</script>
