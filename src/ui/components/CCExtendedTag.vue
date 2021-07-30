<template>
  <v-alert
    v-show="!tag.IsHidden"
    outlined
    dense
    :color="tag.isExotic ? 'exotic' : color"
    border="left"
    class="mb-1"
  >
    <v-icon
      v-if="$vuetify.breakpoint.lgAndUp"
      slot="prepend"
      x-large
      class="ml-n2 mr-1"
      :color="tag.isExotic ? 'exotic' : color"
    >
      label
    </v-icon>
    <span v-if="tag.err">ERR: {{ tag.err.toUpperCase() }}</span>
    <div v-else>
      <h3 :class="`heading ${tag.IsExotic ? 'exotic' : 'accent'}--text`">
        <v-icon
          v-if="$vuetify.breakpoint.mdAndDown"
          class="mt-n1"
          :color="tag.isExotic ? 'exotic' : color"
        >
          label
        </v-icon>
        {{ tag.GetName(bonus) }}
      </h3>
      <p class="text--text body-text pb-0 mb-0" v-html="tag.GetDescription(bonus)" />
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
  @Prop({ type: String, required: false, default: 'active' })
  readonly color: string
  @Prop({ type: Number, required: false, default: 0 })
  readonly bonus?: number
}
</script>
