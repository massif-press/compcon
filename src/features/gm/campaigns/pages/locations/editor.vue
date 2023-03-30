<template>
  <editor-base :item="location" @exit="$router.push('/gm/locations')">
    <v-row density="compact" align="center">
      <v-col cols="12">
        <v-text-field v-model="location.Name" label="Name" />
      </v-col>
      <v-col cols="12">
        <v-textarea
          v-model="location.Description"
          label="Description"
          hint="A brief description of this location"
          variant="outlined"
          auto-grow
          rows="3"
        />
      </v-col>
    </v-row>
  </editor-base>
</template>

<script lang="ts">
import EditorBase from '../../../_components/EditorBase.vue';

export default {
  name: 'location-editor',
  components: { EditorBase },
  props: {
    location: { type: Object, required: true },
  },
};
</script>
