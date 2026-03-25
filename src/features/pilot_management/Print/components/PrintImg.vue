<template>
  <img v-if="resolvedSrc"
    :src="resolvedSrc"
    :style="cover ? 'width:100%;height:100%;object-fit:cover;display:block' : 'width:100%;display:block'" />
</template>

<script lang="ts">
import { GetBlob } from '@/io/Storage';

export default {
  name: 'PrintImg',
  props: {
    src: {
      type: String,
      required: true,
    },
    cover: {
      type: Boolean,
    },
  },
  data: () => ({
    resolvedSrc: '',
  }),
  async created() {
    const isRemote =
      this.src.startsWith('http') || this.src.startsWith('/') || this.src.startsWith('blob:');
    if (isRemote) {
      this.resolvedSrc = this.src;
      return;
    }
    const blob = await GetBlob('images', this.src);
    if (blob) {
      this.resolvedSrc = URL.createObjectURL(blob);
    } else {
      this.resolvedSrc = this.src;
    }
  },
  beforeUnmount() {
    if (this.resolvedSrc?.startsWith('blob:')) URL.revokeObjectURL(this.resolvedSrc);
  },
};
</script>
