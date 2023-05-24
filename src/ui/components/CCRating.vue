<template>
  <v-rating
    :value="model"
    @update:value="(val) => (model = val)"
    hover
    x-large
    density="compact"
    :length="max"
    readonly
    :color="color"
    class="d-inline"
    empty-icon="mdi-hexagon-outline"
    full-icon="mdi-hexagon-slice-6"
    background-color="panel"
  />
</template>

<script lang="ts">
export default {
  name: 'CCRating',
  props: {
    model: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: false,
      default: 6,
    },
    density: {
      type: Boolean,
      required: false,
    },
    color: {
      type: String,
      required: false,
      default: 'accent',
    },
  },
  mounted() {
    // this.$children.forEach((ratingBar) => {
    //   ratingBar.$children.forEach((cell) => {
    //     cell.$el.setAttribute('tabindex', '-1');
    //   });
    // });
  },
};
</script>
