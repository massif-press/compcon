<template>
  <v-row dense class="heading mech mt-n3" style="min-width: 30vw" align="center">
    <v-col cols="auto">
      <v-icon size="70" icon="cc:monist" class="mt-n2" />
    </v-col>
    <v-col>
      <cc-short-string-editor
        large
        justify="start"
        :placeholder="item.Name"
        @set="item.Name = $event">
        <div class="heading-block">
          {{ item.Name }}
        </div>
      </cc-short-string-editor>
    </v-col>
    <v-col cols="auto">
      <div class="text-disabled pr-12 heading h3 text-center">
        tier {{ item.Tier }}
        <v-divider />
        <span>Class {{ item.Class }}</span>
      </div>
    </v-col>
  </v-row>
  <div class="pr-12 mt-1">
    <v-textarea
      density="compact"
      variant="outlined"
      label="Summary (GM Only)"
      hide-detail
      rows="1"
      auto-grow
      v-model="item.GmDescription" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'eidolon-builder-content',
  props: {
    item: { type: Object, required: true },
  },
};
</script>
