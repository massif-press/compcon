<template>
  <div class="mt-n2">
    <v-btn
      v-for="n in max"
      :key="`chk_${item.ID}-${n}_of_${max}`"
      class="d-inline my-0 mx-n1 pa-0"
      icon
      :small="small"
      :large="large"
      :color="color"
      @click.stop="set(n)"
    >
      <v-icon v-html="n <= current ? fullIcon : emptyIcon" />
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { MechEquipment, PilotGear } from '@/class'

@Component({ name: 'cc-item-uses' })
export default class CCItemUses extends Vue {
  @Prop({ type: Boolean })
  readonly small?: boolean
  @Prop({ type: Boolean })
  readonly large?: boolean
  @Prop({ type: String, required: false, default: 'mdi-hexagon-outline' })
  readonly emptyIcon: string
  @Prop({ type: String, required: false, default: 'mdi-hexagon-slice-6' })
  readonly fullIcon: string
  @Prop({ type: String, required: false, default: 'primary' })
  readonly color: string

  @Prop({
    type: Object,
    required: true,
  })
  readonly item!: MechEquipment | PilotGear
  @Prop({ type: Number, required: false, default: 0 })
  readonly bonus: number

  get max(): number {
    return this.item.getTotalUses(this.bonus)
  }
  get current(): number {
    return this.max - this.item.MissingUses
  }

  set(val): void {
    if (val > this.current) Vue.set(this.item, 'Uses', this.item.Uses + 1)
    else Vue.set(this.item, 'Uses', this.item.Uses - 1)
  }
}
</script>
