<template>
  <v-img
    :src="image"
    :key="src"
    @error="handleImageError"
    :cover="cover"
    :aspect-ratio="aspectRatio"
    :position="position"
    :height="height"
    :max-width="maxWidth"
    :min-width="minWidth"
    :max-height="maxHeight"
    :min-height="minHeight"
    :contain="contain"
    :style="style">
    <slot />
  </v-img>
</template>

<script>
import { GetBlob } from '@/io/Storage';

export default {
  name: 'CCImg',
  props: {
    src: {
      type: String,
      required: true,
    },
    cover: {
      type: Boolean,
    },
    aspectRatio: {
      type: [String, Number],
      required: false,
    },
    position: {
      type: String,
      required: false,
    },
    height: {
      type: [String, Number],
      required: false,
    },
    maxWidth: {
      type: [String, Number],
      required: false,
    },
    minWidth: {
      type: [String, Number],
      required: false,
    },
    maxHeight: {
      type: [String, Number],
      required: false,
    },
    minHeight: {
      type: [String, Number],
      required: false,
    },
    contain: {
      type: Boolean,
    },
    style: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    imageUrl: '',
  }),
  watch: {
    src(newVal) {
      this.imageUrl = newVal;
    },
  },
  computed: {
    image() {
      // Get the image blob URI from the src prop
      return this.imageUrl;
    },
  },
  created() {
    this.imageUrl = this.src;
  },
  methods: {
    async handleImageError() {
      // if the image fails to load, create a url from the blob
      const blob = await GetBlob('images', this.src);
      try {
        this.imageUrl = URL.createObjectURL(blob);
      } catch (error) {
        console.error('Failed to create object URL for image:', error);
        this.imageUrl = ''; // Fallback to empty string if URL creation fails
      }
    },
  },
};
</script>
