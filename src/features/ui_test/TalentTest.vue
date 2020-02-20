<template>
  <div v-if="micro">
    icon only
  </div>
  <div v-else-if="small">
    icon and lower right corner rank triangle
  </div>
  <div v-else>
    full component
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import GetColorMixin from '@/mixins/getColor'

@Component({ name: 'talent-test' })
export default class TalentTest extends Mixins(GetColorMixin) {
  @Prop({ type: Boolean, required: false, default: false })
  readonly micro: boolean
  @Prop({ type: Boolean, required: false, default: false })
  readonly small: boolean
}
</script>
