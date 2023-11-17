<template>
  <div>
    {{ $attrs }}
    {{ $props }}
    <v-img v-bind="$props" @error="handleImageError" />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  data() {
    return {
      imageUrl: this.imageBlobUri,
    };
  },
  methods: {
    handleImageError() {
      console.log('Image failed to load');
      // Create a fallback URL for the image blob
      this.imageUrl = 'fallback_image_url.jpg';
    },
  },
  watch: {
    imageBlobUri(newVal) {
      // Update the image URL when the prop changes
      this.imageUrl = newVal;
    },
  },
};
</script>
