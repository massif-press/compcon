<template>
  <span :style="size ? `font-size:${size}pt;` : ``" class="panel-border--text">//</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'cc-slashes', })
export default class CCSlashes extends Vue {
  
  @Prop({ type: [String, Number], required: false, default: '', })
  readonly size: string | number 
}
</script>
