<template>
  <div>
    <v-row
      density="compact"
      class="heading h3"
      justify="space-between"
      align="end"
    >
      <v-col cols="auto">
        <cc-short-string-editor large @set="item.title = $event">
          {{ item.title }}
        </cc-short-string-editor>
      </v-col>
      <v-col cols="auto">
        <v-switch
          v-model="item.Alert"
          label="Emphasize"
          density="compact"
          hide-details
          inset
          class="mt-0"
        />
      </v-col>
    </v-row>
    <cc-rte v-model="item.content" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'campaign-page-text-editor',

  props: {
    item: { type: Object, required: true },
  },
  data: () => ({}),
};
</script>
