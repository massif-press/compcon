<template>
  <v-rating
    v-model="model"
    hover
    x-large
    :dense="dense"
    :length="max"
    readonly
    :color="color"
    class="d-inline"
    empty-icon="mdi-hexagon-outline"
    full-icon="mdi-hexagon-slice-6"
    background-color="panel"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'cc-rating' })
export default class CCRating extends Vue {
  @Prop({ type: Number, required: true })
  readonly model!: number
  @Prop({ type: Number, required: false, default: 6 })
  readonly max: number

  @Prop({ type: Boolean, required: false })
  readonly dense?: boolean
  @Prop({ type: String, required: false, default: 'accent' })
  readonly color: string
}

export { CCRating as CCRanking }
</script>
