<template>
  <div>
    <div class="heading h3 primary white--text pa-1 pl-3 mx-n3 mt-3">
      <v-row no-gutters>
        <v-col>
          <cc-short-string-editor dark left>layer n</cc-short-string-editor>
        </v-col>
        <v-col cols="auto">
          <v-btn icon x-small class="white--text">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <v-row
      style="border: 1px solid rgb(var(--v-theme-primary)); border-radius: 2px"
    >
      <v-col>
        <div class="light-panel pa-2 my-2 stark--text">layer stats</div>
        <v-row>
          <v-col>
            <v-chip>shard</v-chip>
            <v-chip>shard</v-chip>
            <v-chip>shard</v-chip>
            <v-chip>add shard</v-chip>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
export default {
  name: 'eidolon-layer-overview',
};
</script>
