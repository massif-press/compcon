<template>
  <v-img
    v-if="!loadFailed"
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
    fallbackSrc: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    imageUrl: '',
    loadFailed: false,
  }),
  watch: {
    src(newVal) {
      if (this.imageUrl?.startsWith('blob:')) URL.revokeObjectURL(this.imageUrl);
      this.imageUrl = newVal;
      this.loadFailed = false;
    },
  },
  computed: {
    image() {
      return this.imageUrl;
    },
  },
  created() {
    this.imageUrl = this.src;
  },
  beforeUnmount() {
    if (this.imageUrl?.startsWith('blob:')) URL.revokeObjectURL(this.imageUrl);
  },
  methods: {
    async handleImageError() {
      // Try IndexedDB blob lookup for local keys (no protocol prefix)
      const isRemoteUrl =
        this.src.startsWith('http') || this.src.startsWith('/') || this.src.startsWith('blob:');
      if (!isRemoteUrl) {
        const blob = await GetBlob('images', this.src);
        if (blob) {
          this.imageUrl = URL.createObjectURL(blob);
          return;
        }
      }
      // Try the fallback src (e.g. local portrait when cloud URL is stale)
      if (this.fallbackSrc && this.imageUrl !== this.fallbackSrc) {
        this.imageUrl = this.fallbackSrc;
        return;
      }
      this.loadFailed = true;
    },
  },
};
</script>
