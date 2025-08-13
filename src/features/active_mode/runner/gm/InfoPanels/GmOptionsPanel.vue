<template>
  <v-card>
    <v-card-text>
      <div>manual save</div>
      <div>autosave</div>
      <div>round start - pc activation end - unit activation end</div>
      <div>last save</div>
      <br />
      <div>export state</div>
      <div>load state</div>
    </v-card-text>

    <v-card-text>
      <div>set round</div>
      <br />
      <div>quick stat edit</div>
      <div>set stat maxes</div>
      <br />
      <div>undo history</div>
      <div>create undo target</div>
      <br />
      <div>reinforcements</div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'gm-options-panel',
};
</script>
