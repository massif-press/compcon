<template>
  <v-row dense class="heading mech" style="min-width: 30vw; line-height: 1em" align="center">
    <v-col cols="auto">
      <v-icon size="70" icon="cc:monist" class="mt-n2" />
    </v-col>
    <v-col>
      <cc-short-string-editor
        large
        :readonly="readonly"
        justify="start"
        :placeholder="item.Name"
        @set="item.Name = $event">
        <div class="heading-block">
          {{ item.Name }}
        </div>
      </cc-short-string-editor>
    </v-col>
    <v-col cols="auto">
      <div class="pr-12 heading h3 text-center" style="line-height: 1.2em">
        tier {{ item.Tier }}
        <v-divider />
        <span>Class {{ item.Class }}</span>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'eidolon-builder-content',
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
};
</script>
