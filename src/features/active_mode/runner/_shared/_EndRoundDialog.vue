<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <v-btn flat
        block
        variant="text"
        color="accent"
        prepend-icon="mdi-clock-end"
        @click="props.onClick($event)">
        End Round
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar height="40"
          color="primary"
          class="text-center">
          <div class="heading h3 mt-1">
            <v-icon icon="mdi-clock-end"
              class="mt-n1 ml-2"
              start />
            Confirm End Round
          </div>
          <v-spacer />
          <v-btn icon
            :disabled="loading"
            @click="isActive.value = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-toolbar>
        <v-progress-linear v-if="loading"
          indeterminate
          color="accent"
          height="4" />
        <slot :is-active="isActive" />
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{ loading?: boolean }>()
</script>
