<template>
  <v-card color="pilot" class="mt-2 mx-2">
    <v-card-text>
      <v-row dense>
        <v-col cols="auto">
          <v-icon slot="prepend" size="40" class="mr-3" icon="cc:corebonus" />
        </v-col>
        <v-col>
          <div class="heading h3">{{ bonus.Name }}</div>
          <div class="flavor-text text-white">{{ bonus.MountedEffect }}</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'cb-card',
  props: {
    bonus: {
      type: Object,
      required: true,
    },
  },
};
</script>
