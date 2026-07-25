<template>
  <cc-dialog :title="$t('pm.titles.setGroupEmblem')"
    icon="mdi-image" :close-on-click="false" major full-height max-width="90vw">
    <template #activator="{ open }">
      <div class="d-flex justify-center">
        <cc-button size="small"
          color="secondary"
          @click="open">
          <div v-if="!group.Portrait">
            <v-icon start>mdi-plus</v-icon>
            {{ $t('pm.roster.addGroupEmblem') }}
          </div>
          <div v-else>
            <v-icon start>mdi-circle-edit-outline</v-icon>
            {{ $t('pm.roster.editGroupEmblem') }}
          </div>
        </cc-button>
      </div>
    </template>
    <cc-image-selector :item="group"
      type="emblem" />
  </cc-dialog>
</template>

<script setup lang="ts">
defineProps<{ group: any }>()
</script>
