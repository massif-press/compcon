<template>
  <v-toolbar
    :color="getColor()"
    :class="{ 'clipped-large': clipped }"
    :style="fixed ? 'position: fixed; width: 100%; z-index:99' : ''"
  >
    <v-toolbar-title :class="`heading h2 ${dark ? 'white--text' : 'stark--text'}`">
      <v-icon v-if="icon" x-large :dark="dark" class="mt-n1" left>{{ icon }}</v-icon>
      <slot></slot>
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items>
      <slot name="items"></slot>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import GetColorMixin from '@/mixins/getColor'

@Component({ name: 'cc-titlebar' })
export default class CCTitlebar extends Mixins(GetColorMixin) {
  @Prop({ type: Boolean, required: false })
  readonly fixed?: boolean

  @Prop({ type: Boolean, required: false, default: true })
  readonly dark: boolean

  @Prop({ type: Boolean, default: true })
  readonly clipped: boolean

  @Prop({ type: String, required: false, default: 'primary' })
  readonly color: string

  @Prop({ type: String, required: false, default: '' })
  readonly icon: string

  @Prop({ type: Boolean, required: false })
  readonly large?: boolean
}
</script>
