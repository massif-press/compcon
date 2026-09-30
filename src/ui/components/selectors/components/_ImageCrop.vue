<template>
  <v-card-text>
    <div class="cropper-wrapper">
      <cropper
        :stencil-props="stencilProps"
        image-restriction="stencil"
        :canvas="false"
        :debounce="false"
        :default-size="verticalOnly ? defaultSize : undefined"
        :src="src"
        style="border-radius: 20px"
        @change="change"
      />
      <v-card
        class="preview-container"
        variant="outlined"
        color="primary"
      >
        <preview
          :width="previewWidth"
          :height="200"
          :image="result.image"
          :coordinates="result.coordinates"
        />
      </v-card>
    </div>
  </v-card-text>
  <div class="mb-4 mx-10 text-center text-caption">
    {{ $t('ui.image.dragHelp1') }}
    <cc-slashes class="px-4" />
    {{ $t('ui.image.dragHelp2') }}
  </div>
  <v-divider />
  <v-card-actions>
    <v-btn @click="$emit('hide')">{{ $t('common.dismiss') }}</v-btn>
    <slot name="actions" />
    <v-spacer />
    <v-btn
      variant="plain"
      color="success"
      @click="set()"
    >
      {{ confirmLabel || $t('ui.image.setAvatar') }}
    </v-btn>
  </v-card-actions>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Cropper, Preview } from 'vue-advanced-cropper'
  import 'vue-advanced-cropper/dist/style.css'

  defineOptions({ name: 'image-crop' })

  const props = withDefaults(
    defineProps<{
      src: string
      imgKey?: string
      aspectRatio?: number
      verticalOnly?: boolean
      confirmLabel?: string
    }>(),
    {
      imgKey: undefined,
      aspectRatio: 1,
      verticalOnly: false,
      confirmLabel: undefined,
    }
  )

  const emit = defineEmits<{
    confirm: [payload: any]
    hide: []
  }>()

  const result = ref({
    coordinates: null as any,
    image: null as any,
  })
  const stencilProps = props.verticalOnly
    ? {
        handlers: { north: true, south: true },
        lines: { north: true, south: true },
      }
    : { aspectRatio: props.aspectRatio }

  const previewWidth = computed(() => {
    const c = result.value.coordinates
    return Math.round(200 * (c ? c.width / c.height : props.aspectRatio))
  })

  function defaultSize({ imageSize }: { imageSize: { width: number; height: number } }) {
    const height = Math.min(imageSize.height, imageSize.width / props.aspectRatio)
    return { width: height * props.aspectRatio, height }
  }

  function change({ coordinates, image }) {
    result.value = {
      coordinates,
      image,
    }
  }
  function set() {
    if (props.imgKey?.length) result.value.image.src = props.imgKey
    emit('confirm', result.value)
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
