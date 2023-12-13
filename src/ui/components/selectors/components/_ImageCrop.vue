<template>
  <v-card-text>
    <div class="cropper-wrapper">
      <cropper
        :stencil-props="stencilProps"
        image-restriction="stencil"
        :canvas="false"
        :debounce="false"
        :src="src"
        style="border-radius: 20px"
        @change="change"
      />
      <v-card class="preview-container" variant="outlined" color="primary">
        <preview
          :width="200"
          :height="200"
          :image="result.image"
          :coordinates="result.coordinates"
        />
      </v-card>
    </div>
  </v-card-text>
  <div class="mb-4 mx-10 text-center text-caption">
    Drag stencil to move crop target, drag handles to resize <cc-slashes class="px-4" />
    Drag image to reposition, mouse wheel to zoom image
  </div>
  <v-divider />
  <v-card-actions>
    <v-btn @click="$emit('hide')">dismiss</v-btn>
    <v-spacer />
    <v-btn variant="plain" color="success" @click="set()">set avatar</v-btn>
  </v-card-actions>
</template>

<script lang="ts">
import { Cropper, Preview } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

export default {
  name: 'image-crop',
  components: {
    Cropper,
    Preview,
  },
  emits: ['confirm', 'hide'],
  data: () => ({
    result: {
      coordinates: null as any,
      image: null as any,
    },
    stencilProps: {
      aspectRatio: 1,
    },
  }),
  props: {
    src: {
      type: String,
      required: true,
    },
    imgKey: {
      type: String,
      required: false,
    },
  },
  methods: {
    change({ coordinates, image }) {
      this.result = {
        coordinates,
        image,
      };
    },
    set() {
      if (this.imgKey?.length) this.result.image.src = this.imgKey;
      console.log(this.result);
      this.$emit('confirm', this.result);
    },
  },
};
</script>

<style scoped>
.cropper-wrapper {
  overflow: hidden;
  position: relative;
  height: 400px;
}

.preview-container {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
```
