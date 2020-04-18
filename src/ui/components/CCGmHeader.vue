<template>
  <v-row dense>
    <v-col :cols="flip ? '' : 1">
      <hr class="mt-3" />
    </v-col>
    <v-col cols="auto" class="mt-n2">
      <span :class="`heading h2 ${color}--text`">{{ title }}</span>
    </v-col>
    <v-col :cols="flip ? 1 : ''">
      <hr class="mt-3" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'cc-gm-header' })
export default class CCGmHeader extends Vue {
  @Prop({ type: String, required: true })
  readonly title!: string

  @Prop({ type: String, required: false, default: 'accent' })
  readonly color: string
  @Prop({ type: Boolean })
  readonly flip: boolean
}
</script>
