<template>
  <v-row v-if="extended && $vuetify.breakpoint.mdAndUp" no-gutters>
    <v-col v-for="(t, i) in tags" :key="`${t.ID}_${i}`" cols="12">
      <cc-extended-tag :tag="t" :color="t.IsExotic ? 'exotic' : color" />
    </v-col>
  </v-row>
  <div v-else-if="print">
    <v-chip
      v-for="(t, i) in tags"
      :key="`${t.ID}_${i}`"
      outlined
      x-small
      label
      class="mx-1 mt-n1 my-0"
    >
      {{ t.GetName(bonus) }}
    </v-chip>
  </div>
  <div v-else>
    <cc-tag
      v-for="(t, i) in tags"
      :key="`${t.ID}_${i}`"
      :tag="t"
      :small="small"
      :dense="dense"
      :outlined="outlined"
      :color="color"
      :bonus="bonus"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Tag } from '@/class'

@Component({ name: 'cc-tags' })
export default class CCTags extends Vue {
  @Prop({ type: Boolean, required: false })
  readonly small?: boolean
  @Prop({ type: Boolean, required: false })
  readonly dense?: boolean
  @Prop({ type: Boolean, required: false })
  readonly outlined?: boolean

  @Prop({ type: Boolean, required: false })
  readonly extended?: boolean
  @Prop({ type: Boolean, required: false })
  readonly print?: boolean
  @Prop({ type: String, required: false, default: 'primary' })
  readonly color: string

  @Prop({ type: Array, required: true })
  readonly tags!: Tag[]

  @Prop({ type: Number, required: false, default: 0 })
  readonly bonus?: number
}
</script>
