<template>
  <span :style="`opacity: 0.5; ${size ? `font-size:${size}pt;` : ``}`">//</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'cc-slashes' })
export default class CCSlashes extends Vue {
  @Prop({ type: [String, Number], required: false, default: '' })
  readonly size: string | number
}
</script>
