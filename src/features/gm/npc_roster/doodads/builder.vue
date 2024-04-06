<template>
  <div class="heading mech" style="min-width: 30vw">
    <cc-short-string-editor
      :readonly="readonly"
      large
      justify="start"
      :placeholder="item.Name"
      @set="item.Name = $event">
      <div class="heading-block">
        {{ item.Name }}
      </div>
    </cc-short-string-editor>
  </div>
</template>

<script lang="ts">
export default {
  name: 'doodad-builder-content',
  components: {},
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
};
</script>
