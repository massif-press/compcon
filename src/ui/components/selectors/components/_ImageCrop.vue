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
        @change="change" />
      <v-card class="preview-container" variant="outlined" color="primary">
        <preview
          :width="200"
          :height="200"
          :image="result.image"
          :coordinates="result.coordinates" />
      </v-card>
    </div>
  </v-card-text>
  <div class="mb-4 mx-10 text-center text-caption">
    {{ $t('ui.image.dragHelp1') }} <cc-slashes class="px-4" />
    {{ $t('ui.image.dragHelp2') }}
  </div>
  <v-divider />
  <v-card-actions>
    <v-btn @click="$emit('hide')">{{ $t('common.dismiss') }}</v-btn>
    <v-spacer />
    <v-btn variant="plain" color="success" @click="set()">{{ $t('ui.image.setAvatarBtn') }}</v-btn>
  </v-card-actions>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Cropper, Preview } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

defineOptions({ name: 'image-crop' })

const props = defineProps<{
  src: string
  imgKey?: string
}>()

const emit = defineEmits<{
  'confirm': []
  'hide': []
}>()

const result = ref({
      coordinates: null as any,
      image: null as any,
    })
const stencilProps = ref({
      aspectRatio: 1,
    })

function change({ coordinates, image }) {
      result.value = {
        coordinates,
        image,
      };
    }
function set() {
      if (props.imgKey?.length) result.value.image.src = props.imgKey;
      emit('confirm', result.value);
    }
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
