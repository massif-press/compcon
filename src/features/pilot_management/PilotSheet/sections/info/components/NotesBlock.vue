<template>
  <div>
    <cc-title
      small
      color="pilot"
      class="pl-3"
      style="margin-left: -70px !important"
    >
      <span class="ml-9">&emsp;</span>
      Player Notes
    </cc-title>
    <v-textarea
      v-model="pilot.Notes"
      class="mt-2"
      variant="outlined"
      auto-grow
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'notes-block',
};
</script>
