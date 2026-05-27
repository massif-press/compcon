<template>
  <cc-modal title="Set Group Emblem"
    icon="mdi-image">
    <template #activator="{ open }">
      <div class="d-flex justify-center">
        <cc-button size="small"
          color="secondary"
          @click="open">
          <div v-if="!group.Portrait">
            <v-icon start>mdi-plus</v-icon>
            Add group emblem
          </div>
          <div v-else>
            <v-icon start>mdi-circle-edit-outline</v-icon>
            Edit group emblem
          </div>
        </cc-button>
      </div>
    </template>
    <cc-image-selector :item="group"
      type="emblem" />
  </cc-modal>
</template>

<script setup lang="ts">
defineProps<{ group: any }>()
</script>
