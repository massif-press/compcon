<template>
  <v-alert v-show="!tag.IsHidden" outlined dense color="primary" border="left">
    <v-icon
      v-if="$vuetify.breakpoint.lgAndUp"
      slot="prepend"
      x-large
      class="ml-n2 mr-1"
      color="primary"
    >
      label
    </v-icon>
    <span v-if="tag.err">ERR: MISSING DATA</span>
    <div v-else>
      <h3 class="heading accent--text">
        <v-icon v-if="$vuetify.breakpoint.mdAndDown" class="mt-n1" color="primary">label</v-icon>
        {{ tag.GetName() }}
      </h3>
      <p class="text--text body-text pb-0 mb-0" v-html="tag.GetDescription()" />
    </div>
  </v-alert>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Tag } from '@/class'

@Component({ name: 'cc-tag' })
export default class CCExtendedTag extends Vue {
  @Prop({ type: Object, required: true })
  readonly tag: Tag
}
</script>
